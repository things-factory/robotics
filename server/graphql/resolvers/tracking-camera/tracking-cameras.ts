import { ListParam, convertListParams } from '@things-factory/shell'
import { TrackingCamera } from '../../../controllers/vision-types'

export const trackingCamerasResolver = {
  async trackingCameras(_: any, params: ListParam, context: any) {
    // const convertedParams = convertListParams(params)
    // const [items, total] = await getRepository(TrackingCamera).findAndCount({
    //   ...convertedParams,
    //   relations: ['domain', 'creator', 'updater']
    // })
    // return { items, total }
  }
}
