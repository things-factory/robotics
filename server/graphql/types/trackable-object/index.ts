import { TrackableObject } from './tracking-object'
import { TrackableObjectPatch } from './tracking-object-patch'
import { TrackableObjectList } from './tracking-object-list'

export const Mutation = `
  updateTrackableObject (
    name: String!
    patch: TrackableObjectPatch!
  ): TrackableObject
`

export const Query = `
  trackableObjects(filters: [Filter], pagination: Pagination, sortings: [Sorting]): TrackableObjectList
  trackableObject(name: String!): TrackableObject
`

export const Types = [TrackableObject, TrackableObjectPatch, TrackableObjectList]
