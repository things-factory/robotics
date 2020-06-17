import { TrackingCamera } from '../../../controllers/vision-types'

export const updateTrackingCamera = {
  async updateTrackingCamera(_: any, { name, patch }, context: any) {
    // const repository = getRepository(TrackingCamera)
    // const trackingCamera = await repository.findOne({
    //   where: { domain: context.state.domain, name }
    // })
    // return await repository.save({
    //   ...trackingCamera,
    //   ...patch,
    //   updater: context.state.user
    // })
  }
}
