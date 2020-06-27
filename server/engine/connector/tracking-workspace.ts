import { Connections, Connector } from '@things-factory/integration-base'
import { VISION_OBJECT_TYPES } from '../../controllers/vision-types'
import { TrackingEngineImpl } from '../../controllers/tracking-engine'

export class TrackingWorkspace implements Connector {
  async ready(connectionConfigs) {
    await Promise.all(connectionConfigs.map(this.connect))

    Connections.logger.info('tracking-workspace connections are ready')
  }

  async connect(connection) {
    // var { params } = connection
    var engine = new TrackingEngineImpl()

    Connections.addConnection(connection.name, {
      discriminator: VISION_OBJECT_TYPES.WORKSPACE,
      ...connection,
      engine
    })

    engine.start()

    Connections.logger.info(`tracking-workspace connection(${connection.name}:${connection.endpoint}) is connected`)
  }

  async disconnect(name) {
    var { engine } = Connections.removeConnection(name)
    engine && engine.stop()

    Connections.logger.info(`tracking-workspace connection(${name}) is disconnected`)
  }

  get parameterSpec() {
    return []
  }

  get taskPrefixes() {
    return ['tracking']
  }
}

Connections.registerConnector('tracking-workspace', new TrackingWorkspace())
