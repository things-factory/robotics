import { ListParam, convertListParams } from '@things-factory/shell'
import { getRepository } from 'typeorm'
import { Connections, Connection } from '@things-factory/integration-base'

export const robotArmsResolver = {
  async robotArms(_: any, params: ListParam, context: any) {
    const convertedParams = convertListParams(params, context.state.domain.id)
    const [items, total] = await getRepository(Connection).findAndCount({
      ...convertedParams,
      relations: ['domain', 'creator', 'updater']
    })

    items
      .filter(conn => 'isRobotArm' in Connections.getConnection(conn.name))
      .map(conn => {
        var { poseOffset } = conn.params ? JSON.parse(conn.params) : ({} as any)
        conn.status = Connections.getConnection(conn.name) ? 1 : 0

        return {
          ...conn,
          poseOffset
        }
      })

    return { items, total }
  }
}
