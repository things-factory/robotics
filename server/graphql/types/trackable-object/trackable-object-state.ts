import gql from 'graphql-tag'

export const TrackableObjectState = gql`
  input TrackableObjectState {
    pose: PoseInput!
    roi: String!
    retension: Int!
  }
`
