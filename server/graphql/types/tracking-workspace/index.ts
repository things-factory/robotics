import { TrackingWorkspace } from './tracking-workspace'
import { TrackingWorkspaceList } from './tracking-workspace-list'
import { TrackingWorkspaceStatusInput } from './tracking-workspace-status-input'

export const Mutation = `
  updateTrackingWorkspaceStatus(name: String!, status: TrackingWorkspaceStatusInput!): Boolean
`

export const Query = `
  trackingWorkspaces(filters: [Filter], pagination: Pagination, sortings: [Sorting]): TrackingWorkspaceList
  trackingWorkspace(name: String!): TrackingWorkspace
`

export const Types = [TrackingWorkspace, TrackingWorkspaceList, TrackingWorkspaceStatusInput]
