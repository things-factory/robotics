import { VISION_OBJECT_TYPES } from '../../../controllers/vision-types'
import { Connections } from '@things-factory/integration-base'

export const updateTrackableObjectState = {
  async updateTrackableObjectState(_: any, { name, state }, context: any) {
    var connection = Connections.getConnection(name)
    if (!connection || connection.discriminator !== VISION_OBJECT_TYPES.OBJECT) {
      throw Error(`TrackableObject '${name}' Not Found`)
    }

    connection.state = state

    return {
      ...connection
    }
  }
}
