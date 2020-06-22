import gql from 'graphql-tag'

export const RobotArmList = gql`
  type RobotArmList {
    items: [RobotArm]
    total: Int
  }
`
