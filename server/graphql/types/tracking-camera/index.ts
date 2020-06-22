import { TrackingCamera } from './tracking-camera'
import { TrackingCameraList } from './tracking-camera-list'

export const Mutation = `
`

export const Query = `
  trackingCameras(filters: [Filter], pagination: Pagination, sortings: [Sorting]): TrackingCameraList
  trackingCamera(name: String!): TrackingCamera
`

export const Types = [TrackingCamera, TrackingCameraList]
