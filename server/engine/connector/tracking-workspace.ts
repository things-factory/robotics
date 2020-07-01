import { Connections, Connector } from '@things-factory/integration-base'
import { VISION_OBJECT_TYPES } from '../../controllers/vision-types'
import { TrackingEngineImpl } from '../../controllers/tracking-engine'

export class TrackingWorkspace implements Connector {
  async ready(connectionConfigs) {
    await Promise.all(connectionConfigs.map(this.connect))

    Connections.logger.info('tracking-workspace connections are ready')
  }

  async connect(connection) {
    var { name } = connection
    var engine = new TrackingEngineImpl(name)

    Connections.addConnection(connection.name, {
      discriminator: VISION_OBJECT_TYPES.WORKSPACE,
      ...connection,
      engine
    })

    engine.start({ logger: Connections.logger })

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
    return ['tracking-ws']
  }
}

Connections.registerConnector('tracking-workspace', new TrackingWorkspace())
