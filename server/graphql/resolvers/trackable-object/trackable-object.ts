import { VISION_OBJECT_TYPES } from '../../../controllers/vision-types'
import { Connections } from '@things-factory/integration-base'

export const trackableObjectResolver = {
  async trackableObject(_: any, { name }, context: any) {
    var connection = Connections.getConnection(name)
    if (!connection || connection.discriminator !== VISION_OBJECT_TYPES.OBJECT) {
      throw Error(`TrackableObject '${name}' Not Found`)
    }

    var { poseOffset } = connection.params || {}

    return {
      ...connection,
      poseOffset
    }
  }
}
