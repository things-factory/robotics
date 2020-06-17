import { TrackingCamera } from '../../../controllers/vision-types'

export const trackingCameraResolver = {
  async trackingCamera(_: any, { name }, context: any) {
    // const repository = getRepository(TrackingCamera)
    // return await getRepository(TrackingCamera).findOne({
    //   where: { domain: context.state.domain, name },
    //   relations: ['domain', 'creator', 'updater']
    // })
  }
}
