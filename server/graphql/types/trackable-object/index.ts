import { TrackableObject } from './trackable-object'
import { TrackableObjectState } from './trackable-object-state'
import { TrackableObjectList } from './trackable-object-list'

export const Mutation = `
  updateTrackableObjectState (
    name: String!
    state: TrackableObjectState!
  ): TrackableObject
`

export const Query = `
  trackableObjects(filters: [Filter], pagination: Pagination, sortings: [Sorting]): TrackableObjectList
  trackableObject(name: String!): TrackableObject
`

export const Types = [TrackableObject, TrackableObjectState, TrackableObjectList]
