import { VISION_OBJECT_TYPES } from '../../../controllers/vision-types'
import { Connections } from '@things-factory/integration-base'

export const robotArmsResolver = {
  async robotArms(_: any, {}, context: any) {
    var items = Object.keys(Connections.getConnections())
      .map(name => Connections.getConnection(name))
      .filter(connection => connection.discriminator == VISION_OBJECT_TYPES.ROBOT_ARM)
      .map(connection => {
        var { markerOffset, gripperOffset } = connection.params || {}

        return {
          ...connection,
          markerOffset,
          gripperOffset
        }
      })

    return {
      items,
      total: items.length
    }
  }
}
