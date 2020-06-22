import { RobotArm } from '../../../controllers/vision-types'
import { Connections } from '@things-factory/integration-base'

export const robotArmPoseResolver = {
  async robotArmPose(_: any, { name, pose }, context: any) {
    var connection: RobotArm = Connections.getConnection(name)

    if ('isRobotArm' in connection) {
      return connection.pose
    } else {
      throw Error(`RobotArm '${name}' Not Found`)
    }
  }
}
