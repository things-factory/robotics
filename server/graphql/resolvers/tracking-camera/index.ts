import { trackingCameraResolver } from './tracking-camera'
import { trackingCamerasResolver } from './tracking-cameras'
import { detectTrackingCameraROIsResolver } from './detect-tracking-camera-rois'

export const Query = {
  ...trackingCamerasResolver,
  ...trackingCameraResolver,
  ...detectTrackingCameraROIsResolver
}

export const Mutation = {}
