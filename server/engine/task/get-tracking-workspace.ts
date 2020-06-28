import { Connections } from '@things-factory/integration-base'
import { VISION_OBJECT_TYPES } from '../../controllers/vision-types'

export function getTrackingWorkspace() {
  var connectionNames = Object.keys(Connections.getConnections())

  var candidateName = connectionNames.find(
    name => Connections.getConnection(name).discriminator == VISION_OBJECT_TYPES.WORKSPACE
  )

  return candidateName && Connections.getConnection(candidateName)
}
