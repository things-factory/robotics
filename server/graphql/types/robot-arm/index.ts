import { RobotArm } from './robot-arm'
import { RobotArmList } from './robot-arm-list'
import { RobotArmPatch } from './robot-arm-patch'

export const Mutation = `
  updateRobotArm (
    name: String!
    patch: RobotArmPatch!
  ): RobotArm
  updateRobotArmPose (
    name: String!
    pose: Pose!
  ): void
`

export const Query = `
  robotArms(filters: [Filter], pagination: Pagination, sortings: [Sorting]): RobotArmList
  robotArm(name: String!): RobotArm
  robotArmPose(name: String!): Pose
`

export const Types = [RobotArm, RobotArmPatch, RobotArmList]
