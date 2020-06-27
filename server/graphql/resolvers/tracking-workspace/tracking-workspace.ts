import { Connections } from '@things-factory/integration-base'
import { VISION_OBJECT_TYPES } from '../../../controllers/vision-types'

import { trackingCamerasResolver } from '../../resolvers/tracking-camera/tracking-cameras'
import { trackableObjectsResolver } from '../../resolvers/trackable-object/trackable-objects'
import { robotArmsResolver } from '../../resolvers/robot-arm/robot-arms'

export const trackingWorkspaceResolver = {
  async trackingWorkspace(_: any, { name }, context: any) {
    var connection = Connections.getConnection(name)
    if (!connection || connection.discriminator !== VISION_OBJECT_TYPES.WORKSPACE) {
      throw Error(`TrackingWorkspace '${name}' Not Found`)
    }

    // TODO workspace에 해당하는 데이타들만 가져와야 한다.
    var trackingCameras = (await trackingCamerasResolver.trackingCameras(_, {}, context)).items
    var trackableObjects = (await trackableObjectsResolver.trackableObjects(_, {}, context)).items
    var robotArms = (await robotArmsResolver.robotArms(_, {}, context)).items

    return {
      ...connection,
      trackingCameras,
      trackableObjects,
      robotArms
    }
  }
}
