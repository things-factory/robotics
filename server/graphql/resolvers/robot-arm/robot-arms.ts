import { ROBOTICS_OBJECT_TYPES } from '../../../controllers/robotics-types'
import { Connections } from '@things-factory/integration-base'

export const robotArmsResolver = {
  async robotArms(_: any, {}, context: any) {
    var items = Object.keys(Connections.getConnections())
      .map(name => Connections.getConnection(name))
      .filter(connection => connection.discriminator == ROBOTICS_OBJECT_TYPES.ROBOT_ARM)
      .map(connection => {
        var { markerOffset, toolOffset } = connection.params || {}

        return {
          ...connection,
          markerOffset,
          toolOffset
        }
      })

    return {
      items,
      total: items.length
    }
  }
}
