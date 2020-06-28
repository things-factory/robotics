import { trackingWorkspaceResolver } from './tracking-workspace'
import { trackingWorkspacesResolver } from './tracking-workspaces'
import { updateTrackingWorkspaceStatusResolver } from './update-tracking-workspace-status'

export const Query = {
  ...trackingWorkspacesResolver,
  ...trackingWorkspaceResolver
}

export const Mutation = {
  ...updateTrackingWorkspaceStatusResolver
}
