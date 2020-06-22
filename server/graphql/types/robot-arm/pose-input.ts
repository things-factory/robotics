import gql from 'graphql-tag'

export const PoseInput = gql`
  input PoseInput {
    x: Float
    y: Float
    z: Float
    u: Float
    v: Float
    w: Float
  }
`
