import gql from 'graphql-tag'

export const TrackableObjectStateInput = gql`
  input TrackableObjectStateInput {
    pose: PoseInput
    roi: String
  }
`
