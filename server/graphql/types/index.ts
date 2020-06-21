import { VisionTypes } from './vision-types'
import * as TrackingCamera from './tracking-camera'

export const queries = [TrackingCamera.Query]

export const mutations = [TrackingCamera.Mutation]

export const subscriptions = []

export const types = [VisionTypes, ...TrackingCamera.Types]
