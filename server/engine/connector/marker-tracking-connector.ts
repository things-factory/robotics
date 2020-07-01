import { Connections, Connector } from '@things-factory/integration-base'
import { TrackingEngineImpl } from '../../controllers/tracking-engine'
import { ROIStateStorageImpl } from '../../controllers/tracking-storage'
import { VISION_OBJECT_TYPES } from '../../controllers/vision-types'

export class MarkerTrackingWorkspace implements Connector {
  async ready(connectionConfigs) {
    await Promise.all(connectionConfigs.map(this.connect))

    Connections.logger.info('marker-tracking-engine-connector connections are ready')
  }

  async connect(connection) {
    var { name } = connection

    var engine = new TrackingEngineImpl(name)
    engine.trackingStorage = new ROIStateStorageImpl()
    engine.duration = 1000

    Connections.addConnection(connection.name, {
      discriminator: VISION_OBJECT_TYPES.WORKSPACE,
      engine
    })

    Connections.logger.info(
      `marker-tracking-engine-connector connection(${connection.name}:${connection.endpoint}) is connected`
    )
  }

  async disconnect(name) {
    var { engine } = Connections.removeConnection(name)

    engine.stop()

    Connections.logger.info(`marker-tracking-engine-connector connection(${name}) is disconnected`)
  }

  get parameterSpec() {
    return [
      {
        type: 'string',
        label: 'base-robot-arm',
        name: 'baseRobotArm'
      }
    ]
  }

  get taskPrefixes() {
    return ['marker-tracking']
  }
}

Connections.registerConnector('marker-tracking-engine', new MarkerTrackingWorkspace())
