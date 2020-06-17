import { getRepository } from 'typeorm'
import { Connections, Connection } from '@things-factory/integration-base'
import { CameraMatrix, HandEyeMatrix, TrackingCamera } from '../../../controllers/vision-types'

export const updateTrackingCamera = {
  async updateTrackingCamera(_: any, { name, patch }, context: any) {
    const repository = getRepository(Connection)
    const connection = await repository.findOne({
      where: { domain: context.state.domain, name }
    })

    return await repository.save({
      ...connection,
      ...patch,
      updater: context.state.user
    })
  }
}
