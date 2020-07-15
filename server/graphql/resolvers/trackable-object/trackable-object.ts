import { ROBOTICS_OBJECT_TYPES } from '../../../controllers/robotics-types'
import { Connections } from '@things-factory/integration-base'

export const trackableObjectResolver = {
  async trackableObject(_: any, { name }, context: any) {
    var connection = Connections.getConnection(name)
    if (!connection || connection.discriminator !== ROBOTICS_OBJECT_TYPES.OBJECT) {
      throw Error(`TrackableObject '${name}' Not Found`)
    }

    var { poiOffset } = connection.params || {}

    return {
      ...connection,
      poiOffset
    }
  }
}
