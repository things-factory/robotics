import { VisionWorkspace } from './vision-workspace'
import { VisionWorkspaceList } from './vision-workspace-list'

export const Mutation = `
`

export const Query = `
  visionWorkspaces(filters: [Filter], pagination: Pagination, sortings: [Sorting]): VisionWorkspaceList
  visionWorkspace(name: String!): VisionWorkspace
`

export const Types = [VisionWorkspace, VisionWorkspaceList]
