import { sleep } from '@things-factory/utils'
import { Connections, TaskRegistry } from '@things-factory/integration-base'
import { getTrackingWorkspace } from './get-tracking-workspace'

function getObjectState(objectId) {
  var workspace = getTrackingWorkspace()
  var { engine } = workspace
  var { trackingStorage } = engine

  return {
    ...(trackingStorage.getObjectState(objectId) || {})
  }
}

function isValidPose(pose) {
  return (
    !!pose &&
    !['x', 'y', 'z', 'u', 'v', 'w'].find(key => {
      var val = pose[key]
      return isNaN(val) || val === null || val === ''
    })
  )
}

async function TrackableObjectWaitForMove(step, { root, data, logger }) {
  var { name: stepName, connection, params } = step
  var { duration = 1000 } = params || {}

  var object = Connections.getConnection(connection) || {}
  if (!object) {
    throw new Error(`no connection : ${connection}`)
  }

  var { endpoint: objectId } = object

  var lastStatus = data[stepName]

  if (!lastStatus) {
    lastStatus = getObjectState(objectId)
    await sleep(Number(duration))
  }

  var { movedAt: oldMovedAt } = lastStatus

  while (true) {
    let state = root.getState()
    if (state == 1 /* STARTED */) {
      let recentStatus = getObjectState(objectId)
      let { pose, retention: newRetention, movedAt: newMovedAt } = recentStatus

      if (newMovedAt !== oldMovedAt && newRetention > 0 && isValidPose(pose)) {
        lastStatus = recentStatus

        break
      }
      await sleep(Number(duration))
    } else if (state == 2 /* PAUSED */) {
      await sleep(Number(duration))
    } else {
      throw new Error('scenario stopped unexpectedly')
    }
  }

  return {
    data: lastStatus
  }
}

TrackableObjectWaitForMove.parameterSpec = [
  {
    type: 'number',
    name: 'duration',
    label: 'duration',
    placeholder: 'milli-seconds'
  }
]

TaskRegistry.registerTaskHandler('trackable-object-wait-for-move', TrackableObjectWaitForMove)
