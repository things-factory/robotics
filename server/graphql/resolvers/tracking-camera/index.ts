import { trackingCameraResolver } from './tracking-camera'
import { trackingCamerasResolver } from './tracking-cameras'
import { detectTrackingCameraROIs } from './detect-tracking-camera-rois'

export const Query = {
  ...trackingCamerasResolver,
  ...trackingCameraResolver,
  ...detectTrackingCameraROIs
}

export const Mutation = {}
