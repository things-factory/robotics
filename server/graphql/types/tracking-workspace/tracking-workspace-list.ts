import gql from 'graphql-tag'

export const TrackingWorkspaceList = gql`
  type TrackingWorkspaceList {
    items: [TrackingWorkspace]
    total: Int
  }
`
