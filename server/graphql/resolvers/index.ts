import * as TrackingCamera from './tracking-camera'
import * as TrackableObject from './trackable-object'
import * as RobotArm from './robot-arm'
import * as VisionWorkspace from './vision-workspace'

export const queries = [TrackingCamera.Query, TrackableObject.Query, RobotArm.Query, VisionWorkspace.Query]

export const mutations = [
  TrackingCamera.Mutation,
  TrackableObject.Mutation,
  RobotArm.Mutation,
  VisionWorkspace.Mutation
]

export const subscriptions = []
