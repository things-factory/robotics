import { Connections, Connector } from '@things-factory/integration-base'
import { ROBOTICS_OBJECT_TYPES } from '../../controllers/robotics-types'

export class CameraConnector implements Connector {
  async ready(connectionConfigs) {
    await Promise.all(connectionConfigs.map(this.connect.bind(this)))

    Connections.logger.info('camera-connector connections are ready')
  }

  async connect(connection) {
    // var { params } = connection

    Connections.addConnection(connection.name, {
      discriminator: ROBOTICS_OBJECT_TYPES.CAMERA,
      ...connection
    })

    Connections.logger.info(`camera-connector connection(${connection.name}:${connection.endpoint}) is connected`)
  }

  async disconnect(name) {
    Connections.removeConnection(name)

    Connections.logger.info(`camera-connector connection(${name}) is disconnected`)
  }

  get parameterSpec() {
    return [
      {
        type: 'string',
        label: 'device',
        name: 'device'
      },
      {
        type: 'entity-selector',
        label: 'base-robot-arm',
        name: 'baseRobotArm',
        property: {
          queryName: 'robotArms',
          valueKey: 'name'
        }
      },
      {
        type: 'camera-setting',
        label: 'setting',
        name: 'setting'
      },
      {
        type: 'camera-calibration',
        label: 'camera calibration',
        name: 'cameraCalibration'
      },
      {
        type: 'camera-roi',
        label: 'rois',
        name: 'rois'
      },
      {
        type: 'handeye-calibration',
        label: 'handeye matrix',
        name: 'handEyeMatrix'
      }
    ]
  }

  get taskPrefixes() {
    return ['camera']
  }
}

Connections.registerConnector('camera-connector', new CameraConnector())
