import { Connections } from '@things-factory/integration-base'
import { ROBOTICS_OBJECT_TYPES } from '../../../controllers/robotics-types'

import { trackingWorkspaceResolver } from './tracking-workspace'

export const trackingWorkspacesResolver = {
  async trackingWorkspaces(_: any, {}, context: any) {
    var items = Object.keys(Connections.getConnections())
      .map(name => Connections.getConnection(name))
      .filter(connection => connection.discriminator == ROBOTICS_OBJECT_TYPES.WORKSPACE)
      .map(connection =>
        trackingWorkspaceResolver.trackingWorkspace(
          _,
          {
            name: connection.name
          },
          context
        )
      )

    items = await Promise.all(items)

    return {
      items,
      total: items.length
    }
  }
}
