import { Connections, Connector } from '@things-factory/integration-base'
import { ROBOTICS_OBJECT_TYPES } from '../../controllers/robotics-types'

export class MarkedObject implements Connector {
  async ready(connectionConfigs) {
    await Promise.all(connectionConfigs.map(this.connect.bind(this)))

    Connections.logger.info('marked-object connections are ready')
  }

  async connect(connection) {
    // var { params } = connection

    Connections.addConnection(connection.name, {
      discriminator: ROBOTICS_OBJECT_TYPES.OBJECT,
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
        label: 'poi-offset',
        name: 'poiOffset'
      }
    ]
  }

  get taskPrefixes() {
    return ['trackable-object']
  }
}

Connections.registerConnector('marked-object', new MarkedObject())
