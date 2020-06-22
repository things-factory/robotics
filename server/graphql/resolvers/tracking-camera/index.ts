import { trackingCameraResolver } from './tracking-camera'
import { trackingCamerasResolver } from './tracking-cameras'

export const Query = {
  ...trackingCamerasResolver,
  ...trackingCameraResolver
}

export const Mutation = {}
