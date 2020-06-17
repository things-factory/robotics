import { getRepository } from 'typeorm'
import { Connections, Connection } from '@things-factory/integration-base'
import { TrackingCamera } from '../../../controllers/vision-types'

export const trackingCameraResolver = {
  async trackingCamera(_: any, { name }, context: any) {
    var conn = await getRepository(Connection).findOne({
      where: { domain: context.state.domain, name },
      relations: ['domain', 'creator', 'updater']
    })

    if (conn) {
      conn.status = Connections.getConnection(name) ? 1 : 0
    }

    return conn
  }
}
