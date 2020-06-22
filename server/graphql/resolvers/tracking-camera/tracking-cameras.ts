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
      .filter(conn => 'isTrackingCamera' in Connections.getConnection(conn.name))
      .map(conn => {
        var {
          config,
          baseRobotArm: baseRobotArmName,
          cameraMatrix = null,
          handEyeMatrix = null,
          rois = []
        } = conn.params ? JSON.parse(conn.params) : ({} as any)

        var baseRobotArm = Connections.getConnection(baseRobotArmName)

        if (!('isRobotArm' in baseRobotArm)) {
          baseRobotArm = undefined
        }

        return {
          ...conn,
          config,
          baseRobotArm,
          cameraMatrix,
          handEyeMatrix,
          rois
        }
      })

    return { items, total }
  }
}
