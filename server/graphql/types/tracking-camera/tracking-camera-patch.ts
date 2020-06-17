import gql from 'graphql-tag'

export const TrackingCameraPatch = gql`
  input TrackingCameraPatch {
    id: String
    name: String
    description: String
    cuFlag: String
  }
`
