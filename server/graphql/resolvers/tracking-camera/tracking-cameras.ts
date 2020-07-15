import { Connections } from '@things-factory/integration-base'
import { ROBOTICS_OBJECT_TYPES } from '../../../controllers/robotics-types'

export const trackingCamerasResolver = {
  async trackingCameras(_: any, {}, context: any) {
    var items = Object.keys(Connections.getConnections())
      .map(name => Connections.getConnection(name))
      .filter(connection => connection.discriminator == ROBOTICS_OBJECT_TYPES.CAMERA)
      .map(connection => {
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
      })

    return {
      items,
      total: items.length
    }
  }
}
