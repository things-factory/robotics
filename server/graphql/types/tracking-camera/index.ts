import { TrackingCamera } from './tracking-camera'
import { TrackingCameraPatch } from './tracking-camera-patch'
import { TrackingCameraList } from './tracking-camera-list'

export const Mutation = `
  updateTrackingCamera (
    name: String!
    patch: TrackingCameraPatch!
  ): TrackingCamera
`

export const Query = `
  trackingCameras(filters: [Filter], pagination: Pagination, sortings: [Sorting]): TrackingCameraList
  trackingCamera(name: String!): TrackingCamera
`

export const Types = [TrackingCamera, TrackingCameraPatch, TrackingCameraList]
