import * as TrackingCamera from './tracking-camera'
import * as TrackableObject from './trackable-object'
import * as RobotArm from './robot-arm'
import * as TrackingWorkspace from './tracking-workspace'

export const queries = [TrackingCamera.Query, TrackableObject.Query, RobotArm.Query, TrackingWorkspace.Query]

export const mutations = [
  TrackingCamera.Mutation,
  TrackableObject.Mutation,
  RobotArm.Mutation,
  TrackingWorkspace.Mutation
]

export const subscriptions = []
