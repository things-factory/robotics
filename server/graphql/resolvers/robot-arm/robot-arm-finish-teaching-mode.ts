import { ROBOTICS_OBJECT_TYPES } from '../../../controllers/robotics-types'
import { Connections } from '@things-factory/integration-base'

export const robotArmFinishTeachingMode = {
  async robotArmFinishTeachingMode(_: any, { name, state }, context: any) {
    var connection = Connections.getConnection(name)

    if (connection && connection.discriminator == ROBOTICS_OBJECT_TYPES.ROBOT_ARM) {
      /* TODO make it neutral robot arm API */
      var status = await connection.client.finishTeachingMode()
      return true
    } else {
      throw Error(`RobotArm '${name}' Not Found`)
    }
  }
}
