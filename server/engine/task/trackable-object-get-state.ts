import { Connections, TaskRegistry } from '@things-factory/integration-base'
import { getTrackingWorkspace } from './get-tracking-workspace'

async function TrackableObjectGetState(step, { logger }) {
  var { connection } = step

  var object = Connections.getConnection(connection) || {}
  if (!object) {
    throw new Error(`no connection : ${connection}`)
  }

  var { name } = object

  var workspace = getTrackingWorkspace()
  var { engine } = workspace
  var { trackingStorage } = engine

  return {
    data: trackingStorage.getObjectState(name)
  }
}

TrackableObjectGetState.parameterSpec = []

TaskRegistry.registerTaskHandler('trackable-object-get-state', TrackableObjectGetState)
