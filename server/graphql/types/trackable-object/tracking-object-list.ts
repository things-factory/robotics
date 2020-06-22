import gql from 'graphql-tag'

export const TrackableObjectList = gql`
  type TrackableObjectList {
    items: [TrackableObject]
    total: Int
  }
`
