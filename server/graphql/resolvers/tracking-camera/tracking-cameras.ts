import { Connections } from '@things-factory/integration-base'
import { VISION_OBJECT_TYPES } from '../../../controllers/vision-types'

export const trackingCamerasResolver = {
  async trackingCameras(_: any, {}, context: any) {
    var items = Object.keys(Connections.getConnections())
      .map(name => Connections.getConnection(name))
      .filter(connection => connection.discriminator == VISION_OBJECT_TYPES.CAMERA)
      .map(connection => {
        var { handEyeMatrix, cameraCalibration, rois } = connection.params || {}
        var { cameraMatrix, distortionCoefficient } = cameraCalibration || {}
        var baseRobotArm = Connections.getConnection(connection.params?.baseRobotArm)
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
