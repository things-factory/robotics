import { getRepository } from 'typeorm'
import { Connections, Connection } from '@things-factory/integration-base'

export const robotArmResolver = {
  async robotArm(_: any, { name }, context: any) {
    var conn = await getRepository(Connection).findOne({
      where: { domain: context.state.domain, name },
      relations: ['domain', 'creator', 'updater']
    })

    if (!conn || !('isRobotArm' in Connections.getConnection(name))) {
      throw Error(`RobotArm '${name}' Not Found`)
    }

    var { poseOffset } = conn.params ? JSON.parse(conn.params) : ({} as any)

    return {
      ...conn,
      poseOffset
    }
  }
}
