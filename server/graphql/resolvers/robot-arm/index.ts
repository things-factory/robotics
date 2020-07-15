import { robotArmResolver } from './robot-arm'
import { robotArmsResolver } from './robot-arms'
import { robotArmPoseResolver } from './robot-arm-pose'
import { robotArmStartTeachingMode } from './robot-arm-start-teaching-mode'
import { robotArmFinishTeachingMode } from './robot-arm-finish-teaching-mode'

export const Query = {
  ...robotArmsResolver,
  ...robotArmResolver,
  ...robotArmPoseResolver
}

export const Mutation = {
  ...robotArmStartTeachingMode,
  ...robotArmFinishTeachingMode
}
