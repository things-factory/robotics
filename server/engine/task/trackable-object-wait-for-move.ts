import { sleep } from '@things-factory/utils'
import { Connections, TaskRegistry } from '@things-factory/integration-base'
import { getTrackingWorkspace } from './get-tracking-workspace'

async function TrackableObjectWaitForMove(step, { root, data }) {
  var { name: stepName, connection } = step

  var object = Connections.getConnection(connection) || {}
  if (!object) {
    throw new Error(`no connection : ${connection}`)
  }

  var { endpoint: objectId } = object
  var workspace = getTrackingWorkspace()
  var { engine } = workspace
  var { trackingStorage } = engine

  var lastStatus = data[stepName]

  if (!lastStatus) {
    lastStatus = trackingStorage.getObjectState(objectId) || {}
    await sleep(1000)
  }

  var { movedAt: oldMovedAt } = lastStatus

  while (true) {
    let state = root.getState()
    if (state == 1 /* STARTED */) {
      var { retention: newRetention, movedAt: newMovedAt } = trackingStorage.getObjectState(objectId) || {}
      if (newMovedAt !== oldMovedAt && newRetention > 0) {
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
    data: trackingStorage.getObjectState(objectId)
  }
}

TrackableObjectWaitForMove.parameterSpec = []

TaskRegistry.registerTaskHandler('trackable-object-wait-for-move', TrackableObjectWaitForMove)
