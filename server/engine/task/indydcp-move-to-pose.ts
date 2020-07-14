import { Connections, TaskRegistry } from '@things-factory/integration-base'
import { sleep, access } from '@things-factory/utils'
import math3d from 'math3d'

function transform(base, offset) {
  var Vector3 = math3d.Vector3
  var Quaternion = math3d.Quaternion
  var Transform = math3d.Transform

  var t1 = new Transform(new Vector3(base.x, base.y, base.z), Quaternion.Euler(base.u, base.v, base.w))
  var t2 = new Transform()

  t2.parent = t1
  t2.translate(new Vector3(offset.x, offset.y, offset.z))
  t2.rotate(offset.u, offset.v, offset.w, Transform.Space.World)

  var { x, y, z } = t2.position
  var { u, v, w } = t2.rotation

  return { x, y, z, u, v, w }
}

export async function waitForState(client, checkFn) {
  var robotStatus = await client.getRobotStatus()
  while (!checkFn(robotStatus)) {
    await sleep(1000)
    robotStatus = await client.getRobotStatus()
  }
}

async function IndyDcpMoveToPose(step, { logger, data }) {
  var {
    connection,
    params: { type, accessor, viaWaypoint }
  } = step

  var { client } = Connections.getConnection(connection) || {}
  if (!client) {
    throw new Error(`no connection : ${connection}`)
  }
  var { waypointOffset, toolOffset } = client.params || {}

  await waitForState(client, status => !status.isBusy)

  var taskPositions = access(accessor, data)
  if (!taskPositions || typeof taskPositions !== 'object') {
    throw new Error(`correct type task-position is not given : ${taskPositions}`)
  }

  taskPositions = [
    taskPositions[0] || taskPositions['x'],
    taskPositions[1] || taskPositions['y'],
    taskPositions[2] || taskPositions['z'],
    taskPositions[3] || taskPositions['u'],
    taskPositions[4] || taskPositions['v'],
    taskPositions[5] || taskPositions['w']
  ]

  if (isNaN(taskPositions.reduce((sum, v) => sum + v, 0))) {
    throw new Error(`correct value task-position is not given : ${taskPositions}`)
  }

  var destination = transform(taskPositions, toolOffset)

  if (viaWaypoint) {
    var waypoint = transform(destination, waypointOffset)

    if (type == 'BY') {
      await client.taskMoveBy(waypoint)
    } else {
      await client.taskMoveTo(waypoint)
    }

    await waitForState(client, status => !status.isBusy)
  }

  if (type == 'BY') {
    await client.taskMoveBy(destination)
  } else {
    await client.taskMoveTo(destination)
  }

  await waitForState(client, status => !status.isBusy)

  return {
    data: await client.getTaskPos()
  }
}

IndyDcpMoveToPose.parameterSpec = [
  {
    type: 'select',
    label: 'type',
    name: 'type',
    property: {
      options: [
        { display: ' ', value: '' },
        { display: 'MoveTo', value: 'TO' },
        { display: 'MoveBy', value: 'BY' }
      ]
    }
  },
  {
    type: 'string',
    label: 'accessor',
    name: 'accessor'
  },
  {
    type: 'checkbox',
    label: 'viaWaypoint',
    name: 'via-waypoint'
  }
]

TaskRegistry.registerTaskHandler('indydcp-move-to-pose', IndyDcpMoveToPose)
