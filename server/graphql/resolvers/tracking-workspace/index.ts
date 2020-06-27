import { trackingWorkspaceResolver } from './tracking-workspace'
import { trackingWorkspacesResolver } from './tracking-workspaces'

export const Query = {
  ...trackingWorkspacesResolver,
  ...trackingWorkspaceResolver
}

export const Mutation = {}
