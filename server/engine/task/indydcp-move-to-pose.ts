import { Connections, TaskRegistry } from '@things-factory/integration-base'
import { sleep, access } from '@things-factory/utils'
import math3d from 'math3d'

function convertXYZABCtoHM(xyzabc) {
  var H = math3d.Matrix4x4
  var [x,y,z,a,b,c] = xyzabc
  a = a*Math.PI/180
  b = b*Math.PI/180
  c = c*Math.PI/180
  var ca = Math.cos(a)
  var sa = Math.sin(a)
  var cb = Math.cos(b)
  var sb = Math.sin(b)
  var cc = Math.cos(c)
  var sc = Math.sin(c)    
  H = new math3d.Matrix4x4([cb*cc, cc*sa*sb - ca*sc, sa*sc + ca*cc*sb, x, cb*sc, ca*cc + sa*sb*sc, ca*sb*sc - cc*sa, y, -sb, cb*sa, ca*cb, z, 0,0,0,1])
  return H
}

function convertHMtoXYZABC(hm) {
  var H = math3d.Matrix4x4
  var a = 0.0
  var b = 0.0
  var c = 0.0

  H = hm
  var x = H.m14
  var y = H.m24
  var z = H.m34
  if (H.m31 > (1.0 - 1e-10)) {
    b = -Math.PI/2
    a = 0
    c = Math.atan2(-H.m23, H.m22)
  }
  else if (H.m31 < -1.0 + 1e-10) {
    b = Math.PI/2
    a = 0
    c = Math.atan2(H.m23, H.m22)
  }
  else {
    b = Math.atan2(-H.m31, Math.sqrt(H.m11*H.m11 + H.m21*H.m21))
    c = Math.atan2(H.m21, H.m11)
    a = Math.atan2(H.m32, H.m33)    
  }

  return [x, y, z, a*180/Math.PI, b*180/Math.PI, c*180/Math.PI]
}

function transform(base, offset) {
  var Vector3 = math3d.Vector3
  var Quaternion = math3d.Quaternion
  var Transform = math3d.Transform
  var hmTcp2Base = math3d.Matrix4x4
  var hmToolOffset = math3d.Matrix4x4
  var hmRepos = math3d.Matrix4x4
  var xyzuvw = [0.0, 0.0, 0.0, 0.0, 0.0]

  console.log(offset)
  console.error(offset)

  var [bx, by, bz, bu, bv, bw] = base
  var {x:ox, y:oy, z:oz, u:ou, v:ov, w:ow} = offset
  
  hmTcp2Base = convertXYZABCtoHM(base)
  hmToolOffset = convertXYZABCtoHM(offset)
  hmRepos = hmTcp2Base.mul(hmToolOffset)
  xyzuvw = convertHMtoXYZABC(hmRepos)

  return xyzuvw
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

  var { client, params: { waypointOffset, toolOffset } } = Connections.getConnection(connection) || {}
  if (!client) {
    throw new Error(`no connection : ${connection}`)
  }

  await waitForState(client, status => !status.isBusy)

  var taskPositions = access(accessor, data)
  if (!taskPositions || typeof taskPositions !== 'object') {
    throw new Error(`correct type task-position is not given : ${taskPositions}`)
  }
  
  taskPositions = [
    Number(taskPositions[0] || taskPositions['x']),
    Number(taskPositions[1] || taskPositions['y']),
    Number(taskPositions[2] || taskPositions['z']),
    Number(taskPositions[3] || taskPositions['u']),
    Number(taskPositions[4] || taskPositions['v']),
    Number(taskPositions[5] || taskPositions['w'])
  ]

  taskPositions[3] = -taskPositions[3]
  taskPositions[4] = taskPositions[4] + 180.0

  toolOffset = [
      Number(toolOffset[0] || toolOffset['x']),
      Number(toolOffset[1] || toolOffset['y']),
      Number(toolOffset[2] || toolOffset['z']),
      Number(toolOffset[3] || toolOffset['u']),
      Number(toolOffset[4] || toolOffset['v']),
      Number(toolOffset[5] || toolOffset['w'])
  ]

  waypointOffset = [
    Number(waypointOffset[0] || waypointOffset['x']),
    Number(waypointOffset[1] || waypointOffset['y']),
    Number(waypointOffset[2] || waypointOffset['z']),
    Number(waypointOffset[3] || waypointOffset['u']),
    Number(waypointOffset[4] || waypointOffset['v']),
    Number(waypointOffset[5] || waypointOffset['w'])
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
    name: 'viaWaypoint'
  }
]

TaskRegistry.registerTaskHandler('indydcp-move-to-pose', IndyDcpMoveToPose)
