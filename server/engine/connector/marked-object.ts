import { Connections, Connector } from '@things-factory/integration-base'
import { VISION_OBJECT_TYPES } from '../../controllers/vision-types'

export class MarkedObject implements Connector {
  async ready(connectionConfigs) {
    await Promise.all(connectionConfigs.map(this.connect))

    Connections.logger.info('marked-object connections are ready')
  }

  async connect(connection) {
    // var { params } = connection

    Connections.addConnection(connection.name, {
      discriminator: VISION_OBJECT_TYPES.OBJECT,
      ...connection
    })

    Connections.logger.info(`marked-object connection(${connection.name}:${connection.endpoint}) is connected`)
  }

  async disconnect(name) {
    Connections.removeConnection(name)

    Connections.logger.info(`marked-object connection(${name}) is disconnected`)
  }

  get parameterSpec() {
    return [
      {
        type: 'string',
        label: 'type',
        name: 'type'
      },
      {
        type: 'offset-pose',
        label: 'pose-offset',
        name: 'poseOffset'
      }
    ]
  }

  get taskPrefixes() {
    return ['trackable-object']
  }
}

Connections.registerConnector('marked-object', new MarkedObject())
