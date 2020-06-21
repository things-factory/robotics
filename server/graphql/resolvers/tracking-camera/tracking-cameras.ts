import { ListParam, convertListParams } from '@things-factory/shell'
import { getRepository } from 'typeorm'
import { Connections, Connection } from '@things-factory/integration-base'

export const trackingCamerasResolver = {
  async trackingCameras(_: any, params: ListParam, context: any) {
    const convertedParams = convertListParams(params, context.state.domain.id)
    const [items, total] = await getRepository(Connection).findAndCount({
      ...convertedParams,
      relations: ['domain', 'creator', 'updater']
    })

    items
      // .filter(conn => Connections.getConnection(conn.name) instanceof TrackingCamera)
      .map(conn => {
        var { cameraMatrix = null, handEyeMatrix = null, rois = [] } = conn.params
          ? JSON.parse(conn.params)
          : ({} as any)
        conn.status = Connections.getConnection(conn.name) ? 1 : 0

        return {
          ...conn,
          cameraMatrix,
          handEyeMatrix,
          rois
        }
      })

    return { items, total }
  }
}
