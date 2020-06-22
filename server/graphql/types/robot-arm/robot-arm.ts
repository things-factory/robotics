import gql from 'graphql-tag'

export const RobotArm = gql`
  type RobotArm {
    id: String
    name: String
    domain: Domain
    description: String
    type: String
    endpoint: String
    active: Boolean
    params: Object
    poseOffset: Pose
    updater: User
    creator: User
    updatedAt: String
    createdAt: String
  }
`
