import { robotArmResolver } from './robot-arm'
import { robotArmsResolver } from './robot-arms'
import { robotArmPoseResolver } from './robot-arm-pose'

import { updateRobotArmPose } from './update-robot-arm-pose'

export const Query = {
  ...robotArmsResolver,
  ...robotArmResolver,
  ...robotArmPoseResolver
}

export const Mutation = {
  ...updateRobotArmPose
}
