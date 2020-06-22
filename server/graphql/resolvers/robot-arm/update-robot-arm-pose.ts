import { VISION_OBJECT_TYPES } from '../../../controllers/vision-types'
import { Connections } from '@things-factory/integration-base'

export const updateRobotArmPose = {
  async updateRobotArmPose(_: any, { name, pose }, context: any) {
    var connection = Connections.getConnection(name)
    if (!connection || connection.discriminator !== VISION_OBJECT_TYPES.ROBOT_ARM) {
      throw Error(`RobotArm '${name}' Not Found`)
    }

    connection.pose = pose
    // await .. until move finished

    return {
      ...connection
    }
  }
}
