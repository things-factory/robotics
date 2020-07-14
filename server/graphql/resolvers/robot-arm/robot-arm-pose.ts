import { VISION_OBJECT_TYPES } from '../../../controllers/vision-types'
import { Connections } from '@things-factory/integration-base'

export const robotArmPoseResolver = {
  async robotArmPose(_: any, { name, pose }, context: any) {
    var connection = Connections.getConnection(name)

    if (connection && connection.discriminator == VISION_OBJECT_TYPES.ROBOT_ARM) {
      return await connection.getTaskPos()
    } else {
      throw Error(`RobotArm '${name}' Not Found`)
    }
  }
}
