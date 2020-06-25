import gql from 'graphql-tag'

export const TrackableObject = gql`
  type TrackableObject {
    id: String
    name: String
    domain: Domain
    description: String
    type: String
    endpoint: String
    status: Int
    active: Boolean
    config: Object
    poiOffset: Pose
    updater: User
    creator: User
    updatedAt: String
    createdAt: String
  }
`
