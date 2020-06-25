import { VISION_OBJECT_TYPES } from '../../../controllers/vision-types'
import { Connections } from '@things-factory/integration-base'

export const trackableObjectsResolver = {
  async trackableObjects(_: any, {}, context: any) {
    var items = Object.keys(Connections.getConnections())
      .map(name => Connections.getConnection(name))
      .filter(connection => connection.discriminator == VISION_OBJECT_TYPES.OBJECT)
      .map(connection => {
        var { poiOffset } = connection.params || {}

        return {
          ...connection,
          poiOffset
        }
      })

    return {
      items,
      total: items.length
    }
  }
}
