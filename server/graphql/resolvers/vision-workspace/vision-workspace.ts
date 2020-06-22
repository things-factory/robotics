import { Connections } from '@things-factory/integration-base'
import { VISION_OBJECT_TYPES } from '../../../controllers/vision-types'

export const visionWorkspaceResolver = {
  async visionWorkspace(_: any, { name }, context: any) {
    var connection = Connections.getConnection(name)
    if (!connection || connection.discriminator !== VISION_OBJECT_TYPES.WORKSPACE) {
      throw Error(`VisionWorkspace '${name}' Not Found`)
    }

    return {
      ...connection
    }
  }
}
