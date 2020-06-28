import { sleep } from '@things-factory/utils'
import { Connections, TaskRegistry } from '@things-factory/integration-base'
import { getTrackingWorkspace } from './get-tracking-workspace'

async function TrackableObjectWaitForMove(step, { logger }) {
  var { connection } = step

  var object = Connections.getConnection(connection) || {}
  if (!object) {
    throw new Error(`no connection : ${connection}`)
  }

  var { name } = object

  var workspace = getTrackingWorkspace()
  var { engine } = workspace
  var { trackingStorage } = engine

  var { pose: oldPose, roi: oldROI } = trackingStorage.getObjectState(name)
  await sleep(1000)

  while (true) {
    var { pose: newPose, roi: newROI } = trackingStorage.getObjectState(name)
    if (oldPose !== newPose || oldROI !== newROI) {
      break
    }
    await sleep(1000)
  }

  return {
    data: trackingStorage.getObjectState(name)
  }
}

TrackableObjectWaitForMove.parameterSpec = []

TaskRegistry.registerTaskHandler('trackable-object-wait-for-move', TrackableObjectWaitForMove)
