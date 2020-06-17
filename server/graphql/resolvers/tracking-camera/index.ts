import { trackingCameraResolver } from './tracking-camera'
import { trackingCamerasResolver } from './tracking-cameras'

import { updateTrackingCamera } from './update-tracking-camera'

export const Query = {
  ...trackingCamerasResolver,
  ...trackingCameraResolver
}

export const Mutation = {
  ...updateTrackingCamera
}
