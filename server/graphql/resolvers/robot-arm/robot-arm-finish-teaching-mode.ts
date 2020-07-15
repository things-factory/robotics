import { ROBOTICS_OBJECT_TYPES } from '../../../controllers/robotics-types'
import { Connections } from '@things-factory/integration-base'

export const robotArmFinishTeachingMode = {
  async robotArmFinishTeachingMode(_: any, { name, state }, context: any) {
    var connection = Connections.getConnection(name)

    if (connection && connection.discriminator == ROBOTICS_OBJECT_TYPES.ROBOT_ARM) {
      /* TODO 지금은 indydcp API finishDirectTeaching를 사용하고 있지만, 로봇암 중립적인 API를 정의해서 사용해야한다. */
      var status = await connection.client.finishDirectTeaching()
      return true
    } else {
      throw Error(`RobotArm '${name}' Not Found`)
    }
  }
}
