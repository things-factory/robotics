import { Connections } from '@things-factory/integration-base'
import { ROBOTICS_OBJECT_TYPES } from '../../../controllers/robotics-types'

export const trackingCameraResolver = {
  async trackingCamera(_: any, { name }, context: any) {
    var connection = Connections.getConnection(name)
    if (!connection || connection.discriminator !== ROBOTICS_OBJECT_TYPES.CAMERA) {
      throw Error(`TrackingCamera '${name}' Not Found`)
    }

    var { baseRobotArm: baseRobotArmName, handEyeMatrix, cameraCalibration, rois } = connection.params || {}

    var { cameraMatrix, distortionCoefficient } = cameraCalibration || {}
    var baseRobotArm = Connections.getConnection(baseRobotArmName)

    if (!baseRobotArm || baseRobotArm.discriminator !== ROBOTICS_OBJECT_TYPES.ROBOT_ARM) {
      baseRobotArm = undefined
    }

    return {
      ...connection,
      cameraMatrix,
      distortionCoefficient,
      handEyeMatrix,
      baseRobotArm,
      rois
    }
  }
}
