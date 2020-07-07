import { VISION_OBJECT_TYPES } from '../../../controllers/vision-types'
import { Connections } from '@things-factory/integration-base'

export const updateTrackingWorkspaceStatusResolver = {
  async updateTrackingWorkspaceStatus(_: any, { name, status }, context: any) {
    var workspace = Connections.getConnection(name)
    if (!workspace || workspace.discriminator !== VISION_OBJECT_TYPES.WORKSPACE) {
      throw Error(`Tracking Workspace '${name}' Not Found`)
    }

    var { engine, params } = workspace
    var storage = engine.trackingStorage
    var { objectStatus } = status

    objectStatus.forEach(state => {
      var {
        id,
        state: { roi, pose }
      } = state
      storage.updateObjectState(id, roi, pose, params?.poseThreshold)
    })

    return true
  }
}
