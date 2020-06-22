import { VisionTypes } from './vision-types'
import * as RobotArm from './robot-arm'
import * as TrackableObject from './trackable-object'
import * as TrackingCamera from './tracking-camera'
import * as VisionWorkspace from './vision-workspace'

export const queries = [RobotArm.Query, TrackableObject.Query, TrackingCamera.Query, VisionWorkspace.Query]

export const mutations = [
  RobotArm.Mutation,
  TrackableObject.Mutation,
  TrackingCamera.Mutation,
  VisionWorkspace.Mutation
]

export const subscriptions = []

export const types = [
  VisionTypes,
  ...RobotArm.Types,
  ...TrackableObject.Types,
  ...TrackingCamera.Types,
  ...VisionWorkspace.Types
]
