import { ROBOTICS_OBJECT_TYPES } from '../../../controllers/robotics-types'
import { Connections } from '@things-factory/integration-base'

export const trackableObjectsResolver = {
  async trackableObjects(_: any, {}, context: any) {
    var items = Object.keys(Connections.getConnections())
      .map(name => Connections.getConnection(name))
      .filter(connection => connection.discriminator == ROBOTICS_OBJECT_TYPES.OBJECT)
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
