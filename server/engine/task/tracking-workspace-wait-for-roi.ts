import { sleep } from '@things-factory/utils'
import { Connections, TaskRegistry } from '@things-factory/integration-base'
import { getTrackingWorkspace } from './get-tracking-workspace'

function getROIState(roi) {
  var workspace = getTrackingWorkspace()
  if (!workspace) {
    /* TODO workspace가 없는 경우와, ROI가 빈 경우에 대한 구분처리가 필요하다. */
    return []
  }

  var { engine } = workspace
  var { trackingStorage } = engine

  return trackingStorage.getROIState(roi).filter(obj => obj.retention > 0)
}

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

  var lastObjects = data[name]

  if (!lastObjects) {
    lastObjects = getROIState(roi)
  }

  while (true) {
    let state = root.getState()
    if (state == 1 /* STARTED */) {
      var objects = getROIState(roi)

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
