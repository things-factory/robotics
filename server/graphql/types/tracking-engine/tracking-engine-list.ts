import gql from 'graphql-tag'

export const TrackingCameraList = gql`
  type TrackingCameraList {
    items: [TrackingCamera]
    total: Int
  }
`
