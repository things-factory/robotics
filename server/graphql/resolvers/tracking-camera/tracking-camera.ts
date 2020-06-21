import { getRepository } from 'typeorm'
import { Connections, Connection } from '@things-factory/integration-base'

export const trackingCameraResolver = {
  async trackingCamera(_: any, { name }, context: any) {
    var conn = await getRepository(Connection).findOne({
      where: { domain: context.state.domain, name },
      relations: ['domain', 'creator', 'updater']
    })

    if (conn) {
      conn.status = Connections.getConnection(name) ? 1 : 0
    }

    var { cameraMatrix = null, handEyeMatrix = null, rois = [] } = conn.params ? JSON.parse(conn.params) : ({} as any)

    return {
      ...conn,
      cameraMatrix,
      handEyeMatrix,
      rois
    }
  }
}
