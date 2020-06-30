import { sleep } from '@things-factory/utils'
import { Connections, TaskRegistry } from '@things-factory/integration-base'
import { getTrackingWorkspace } from './get-tracking-workspace'

async function TrackingWorkspaceWaitForROI(step, { root, data }) {
  var {
    name,
    connection,
    params: { roi, waitFor }
  } = step

  // var workspace = Connections.getConnection(connection) || {}
  // if (!workspace) {
  //   throw new Error(`no connection : ${connection}`)
  // }

  var workspace = getTrackingWorkspace()
  var { engine } = workspace
  var { trackingStorage } = engine

  var lastObjects = data[name]

  if (!lastObjects) {
    lastObjects = trackingStorage.getROIState(roi).filter(obj => obj.retention > 0)
    await sleep(1000)
  }

  while (true) {
    let state = root.getState()
    if (state == 1 /* STARTED */) {
      var objects = trackingStorage.getROIState(roi).filter(obj => obj.retention > 0)

      var changed =
        lastObjects.length !== objects.length ||
        objects.find((object, idx) => {
          var lastObject = lastObjects[idx]
          return object.id != lastObject.id
        })

      if (changed) {
        lastObjects = objects

        if (waitFor == 'empty' && objects.length == 0) {
          break
        } else if (waitFor == 'fill' && objects.length > 0) {
          break
        }
      }

      await sleep(1000)
    } else if (state == 2 /* PAUSED */) {
      await sleep(1000)
    } else {
      throw new Error('scenario stopped unexpectedly')
    }
  }

  return {
    data: objects
  }
}

TrackingWorkspaceWaitForROI.parameterSpec = [
  {
    type: 'string',
    name: 'roi',
    label: 'roi'
  },
  {
    type: 'select',
    name: 'waitFor',
    label: 'wait-for',
    property: {
      options: [
        { display: '', value: '' },
        { display: 'Being Fill', value: 'fill' },
        { display: 'Being Empty', value: 'empty' }
      ]
    }
  }
]

TaskRegistry.registerTaskHandler('tracking-ws-wait-for-roi', TrackingWorkspaceWaitForROI)