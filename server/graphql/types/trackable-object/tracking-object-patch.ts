import gql from 'graphql-tag'

// CONFIRM-ME 이 타입이 필요한가 ?
export const TrackableObjectPatch = gql`
  input TrackableObjectPatch {
    id: String
    name: String
    description: String
    cuFlag: String
  }
`
