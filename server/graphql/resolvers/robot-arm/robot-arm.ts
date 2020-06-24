import { VISION_OBJECT_TYPES } from '../../../controllers/vision-types'
import { Connections } from '@things-factory/integration-base'

export const robotArmResolver = {
  async robotArm(_: any, { name }, context: any) {
    var connection = Connections.getConnection(name)
    if (!connection || connection.discriminator !== VISION_OBJECT_TYPES.ROBOT_ARM) {
      throw Error(`RobotArm '${name}' Not Found`)
    }

    var { markerOffset, gripperOffset } = connection.params || {}

    return {
      ...connection,
      markerOffset,
      gripperOffset
    }
  }
}
