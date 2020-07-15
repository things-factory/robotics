import { ROBOTICS_OBJECT_TYPES } from '../../../controllers/robotics-types'
import { Connections } from '@things-factory/integration-base'

export const robotArmPoseResolver = {
  async robotArmPose(_: any, { name }, context: any) {
    var connection = Connections.getConnection(name)

    if (connection && connection.discriminator == ROBOTICS_OBJECT_TYPES.ROBOT_ARM) {
      var [x, y, z, u, v, w] = await connection.getTaskPos()
      return {
        x,
        y,
        z,
        u,
        v,
        w
      }
    } else {
      throw Error(`RobotArm '${name}' Not Found`)
    }
  }
}
