import { trackingCameraResolver } from './tracking-camera'
import { trackingCamerasResolver } from './tracking-cameras'
import { detectTrackingCameraROIsResolver } from './detect-tracking-camera-rois'
import { calibrateHandeyeMatrixResolver } from './calibrate-handeye-matrix-resolver'

export const Query = {
  ...trackingCamerasResolver,
  ...trackingCameraResolver,
  ...detectTrackingCameraROIsResolver,
  ...calibrateHandeyeMatrixResolver
}

export const Mutation = {}
