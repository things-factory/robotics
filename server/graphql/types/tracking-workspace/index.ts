import { TrackingWorkspace } from './tracking-workspace'
import { TrackingWorkspaceList } from './tracking-workspace-list'

export const Mutation = `
`

export const Query = `
  trackingWorkspaces(filters: [Filter], pagination: Pagination, sortings: [Sorting]): TrackingWorkspaceList
  trackingWorkspace(name: String!): TrackingWorkspace
`

export const Types = [TrackingWorkspace, TrackingWorkspaceList]
