import gql from 'graphql-tag'

export const TrackingWorkspaceStatusInput = gql`
  input TrackingWorkspaceStateInput {
    id: String!
    state: TrackableObjectStateInput
  }

  input TrackingWorkspaceStatusInput {
    objectStatus: [TrackingWorkspaceStateInput]
  }
`
