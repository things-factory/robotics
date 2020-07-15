import { Connections } from '@things-factory/integration-base'
import { ROBOTICS_OBJECT_TYPES } from '../../controllers/robotics-types'

export function getTrackingWorkspace() {
  var connectionNames = Object.keys(Connections.getConnections())

  var candidateName = connectionNames.find(
    name => Connections.getConnection(name).discriminator == ROBOTICS_OBJECT_TYPES.WORKSPACE
  )

  return candidateName && Connections.getConnection(candidateName)
}
