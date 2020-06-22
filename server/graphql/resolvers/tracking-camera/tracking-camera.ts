import { getRepository } from 'typeorm'
import { Connections, Connection } from '@things-factory/integration-base'
import { VISION_OBJECT_TYPES } from 'server/controllers/vision-types'

export const trackingCameraResolver = {
  async trackingCamera(_: any, { name }, context: any) {
    var connection = Connections.getConnection(name)
    if (!connection || connection.visionObjectType !== VISION_OBJECT_TYPES.CAMERA) {
      throw Error(`TrackingCamera '${name}' Not Found`)
    }

    var baseRobotArm = Connections.getConnection(connection.params?.baseRobotArm)

    if (!baseRobotArm || connection.visionObjectType !== VISION_OBJECT_TYPES.ROBOT_ARM) {
      baseRobotArm = undefined
    }

    return {
      ...connection,
      baseRobotArm
    }
  }
}
