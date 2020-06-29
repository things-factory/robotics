import { sleep } from '@things-factory/utils'
import { Connections, TaskRegistry } from '@things-factory/integration-base'
import { getTrackingWorkspace } from './get-tracking-workspace'

async function TrackableObjectWaitForMove(step, { root, data }) {
  var { name: stepName, connection } = step

  var object = Connections.getConnection(connection) || {}
  if (!object) {
    throw new Error(`no connection : ${connection}`)
  }

  var workspace = getTrackingWorkspace()
  var { engine } = workspace
  var { trackingStorage } = engine

  var { name } = object

  var lastStatus = data[stepName]

  if (!lastStatus) {
    lastStatus = trackingStorage.getObjectState(name) || {}
    await sleep(1000)
  }

  var { pose: oldPose, roi: oldROI } = lastStatus

  while (true) {
    let state = root.getState()
    if (state == 1 /* STARTED */) {
      var { pose: newPose, roi: newROI } = trackingStorage.getObjectState(name) || {}
      if (oldPose !== newPose || oldROI !== newROI) {
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
    data: trackingStorage.getObjectState(name)
  }
}

TrackableObjectWaitForMove.parameterSpec = []

TaskRegistry.registerTaskHandler('trackable-object-wait-for-move', TrackableObjectWaitForMove)
