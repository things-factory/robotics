import { TrackableObject } from './trackable-object'
import { TrackableObjectList } from './trackable-object-list'
import { TrackableObjectStateInput } from './trackable-object-state'

export const Mutation = `
  updateTrackableObjectState (
    name: String!
    state: TrackableObjectStateInput!
  ): TrackableObject
`

export const Query = `
  trackableObjects(filters: [Filter], pagination: Pagination, sortings: [Sorting]): TrackableObjectList
  trackableObject(name: String!): TrackableObject
`

export const Types = [TrackableObject, TrackableObjectStateInput, TrackableObjectList]
