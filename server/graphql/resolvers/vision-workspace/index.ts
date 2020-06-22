import { visionWorkspaceResolver } from './vision-workspace'
import { visionWorkspacesResolver } from './vision-workspaces'

export const Query = {
  ...visionWorkspacesResolver,
  ...visionWorkspaceResolver
}

export const Mutation = {}
