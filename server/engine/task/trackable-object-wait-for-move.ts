import { sleep } from '@things-factory/utils'
import { Connections, TaskRegistry } from '@things-factory/integration-base'
import { getTrackingWorkspace } from './get-tracking-workspace'

async function TrackableObjectWaitForMove(step, { logger }) {
  var { connection } = step

  var { object } = Connections.getConnection(connection) || {}
  if (!object) {
    throw new Error(`no connection : ${connection}`)
  }

  var { name } = object

  var workspace = getTrackingWorkspace()
  var { engine } = workspace
  var { objectStorage } = engine

  var { pose: oldPose, roi: oldROI } = objectStorage.getObjectState(name)
  await sleep(1000)

  while (true) {
    var { pose: newPose, roi: newROI } = objectStorage.getObjectState(name)
    if (oldPose !== newPose || oldROI !== newROI) {
      break
    }
    await sleep(1000)
  }

  return {
    data: objectStorage.getObjectState(name)
  }
}

TrackableObjectWaitForMove.parameterSpec = []

TaskRegistry.registerTaskHandler('trackable-object-wait-for-move', TrackableObjectWaitForMove)
