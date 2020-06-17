import gql from 'graphql-tag'

export const TrackingCamera = gql`
  type TrackingCamera {
    id: String
    name: String
    domain: Domain
    description: String
    type: String
    endpoint: String
    status: Int
    active: Boolean
    params: String
    updater: User
    creator: User
    updatedAt: String
    createdAt: String
  }
`
