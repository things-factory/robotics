import { ListParam, convertListParams } from '@things-factory/shell'
import { getRepository } from 'typeorm'
import { Connections, Connection } from '@things-factory/integration-base'
import { CameraMatrix, HandEyeMatrix, TrackingCamera } from '../../../controllers/vision-types'

export const trackingCamerasResolver = {
  async trackingCameras(_: any, params: ListParam, context: any) {
    const convertedParams = convertListParams(params, context.state.domain.id)
    const [items, total] = await getRepository(Connection).findAndCount({
      ...convertedParams,
      relations: ['domain', 'creator', 'updater']
    })

    items.forEach(conn => {
      conn.status = Connections.getConnection(conn.name) ? 1 : 0
    })

    // items = items.filter(conn => Connections.getConnection(conn.name) instanceof TrackingCamera)

    return { items, total }
  }
}
