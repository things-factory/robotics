import { Connections, Connector } from '@things-factory/integration-base'
import { VisionSensorEngine } from '../../controllers/vision-sensor/vision-sensor-engine'

export class VisionSensorConnector implements Connector {
  async ready(connectionConfigs) {
    await Promise.all(connectionConfigs.map(this.connect))

    Connections.logger.info('vision-sensor-connector connections are ready')
  }

  async connect(connection) {
    var { params } = connection

    var engine = new VisionSensorEngine()

    Connections.addConnection(connection.name, engine)

    Connections.logger.info(
      `vision-sensor-connector connection(${connection.name}:${connection.endpoint}) is connected`
    )
  }

  async disconnect(name) {
    var engine = Connections.removeConnection(name)

    engine.stop()

    Connections.logger.info(`vision-sensor-connector connection(${name}) is disconnected`)
  }

  get parameterSpec() {
    return []
  }

  get taskPrefixes() {
    return ['vision-sensor']
  }
}

Connections.registerConnector('vision-sensor-connector', new VisionSensorConnector())
