import gql from 'graphql-tag'

export const VisionWorkspaceList = gql`
  type VisionWorkspaceList {
    items: [VisionWorkspace]
    total: Int
  }
`
