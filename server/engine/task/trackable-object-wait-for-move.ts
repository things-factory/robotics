import { sleep } from '@things-factory/utils'
import { Connections, TaskRegistry } from '@things-factory/integration-base'
import { getTrackingWorkspace } from './get-tracking-workspace'

function getObjectState(objectId) {
  var workspace = getTrackingWorkspace()
  var { engine } = workspace
  var { trackingStorage } = engine

  return trackingStorage.getObjectState(objectId) || {}
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

async function TrackableObjectWaitForMove(step, { root, data }) {
  var { name: stepName, connection } = step

  var object = Connections.getConnection(connection) || {}
  if (!object) {
    throw new Error(`no connection : ${connection}`)
  }

  var { endpoint: objectId } = object

  var lastStatus = data[stepName]

  if (!lastStatus) {
    lastStatus = getObjectState(objectId)
    await sleep(1000)
  }

  var { movedAt: oldMovedAt } = lastStatus

  while (true) {
    let state = root.getState()
    if (state == 1 /* STARTED */) {
      var { pose, retention: newRetention, movedAt: newMovedAt } = getObjectState(objectId)

      if (newMovedAt !== oldMovedAt && newRetention > 0 && isValidPose(pose)) {
        break
      }
      await sleep(1000)
    } else if (state == 2 /* PAUSED */) {
      await sleep(1000)
    } else {
      throw new Error('scenario stopped unexpectedly')
    }
  }

  return {
    data: getObjectState(objectId)
  }
}

TrackableObjectWaitForMove.parameterSpec = []

TaskRegistry.registerTaskHandler('trackable-object-wait-for-move', TrackableObjectWaitForMove)
