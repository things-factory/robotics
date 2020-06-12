import { Connections, Connector } from '@things-factory/integration-base'
import { MarkerTrackingEngine } from '../../controllers/marker-tracker/marker-tracking-engine'
import { ROIStateStorageImpl } from 'server/controllers/marker-tracker/marker-state-storage'

export class MarkerTrackingEngineConnector implements Connector {
  async ready(connectionConfigs) {
    await Promise.all(connectionConfigs.map(this.connect))

    Connections.logger.info('marker-tracking-engine-connector connections are ready')
  }

  async connect(connection) {
    var { params } = connection

    var engine = new MarkerTrackingEngine(new ROIStateStorageImpl())

    Connections.addConnection(connection.name, engine)

    Connections.logger.info(
      `marker-tracking-engine-connector connection(${connection.name}:${connection.endpoint}) is connected`
    )
  }

  async disconnect(name) {
    var engine = Connections.removeConnection(name)

    engine.stop()

    Connections.logger.info(`marker-tracking-engine-connector connection(${name}) is disconnected`)
  }

  get parameterSpec() {
    return []
  }

  get taskPrefixes() {
    return ['marker-tracking']
  }
}

Connections.registerConnector('marker-tracking-engine', new MarkerTrackingEngineConnector())
