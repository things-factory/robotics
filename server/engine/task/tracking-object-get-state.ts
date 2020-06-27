import { Connections, TaskRegistry } from '@things-factory/integration-base'

async function TrackingObjectGetState(step, { logger }) {
  var { connection } = step

  var { object } = Connections.getConnection(connection) || {}
  if (!object) {
    throw new Error(`no connection : ${connection}`)
  }

  var { pose, roi } = object.state

  return {
    data: {}
  }
}

TrackingObjectGetState.parameterSpec = []

TaskRegistry.registerTaskHandler('tracking-object-get-state', TrackingObjectGetState)
