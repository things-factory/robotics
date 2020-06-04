import rs2 from '@things-factory/node-librealsense2'
import { SENSOR, STREAM, DEFAULT_CONFIG } from './realsense-const'
import { RealsenseCameraSensor } from './realsense-camera-sensor'

import Debug from 'debug'
const debug = Debug('things-factory:vision-base:realsense-camera')

export class RealsenseCamera {
  profiles = {
    [SENSOR.RGB]: {
      [STREAM.COLOR]: []
    },
    [SENSOR.STEREO]: {
      [STREAM.DEPTH]: [],
      [STREAM.INFRARED]: []
    }
  }

  active = {
    [SENSOR.RGB]: {
      [STREAM.COLOR]: -1
    },
    [SENSOR.STEREO]: {
      [STREAM.DEPTH]: -1,
      [STREAM.INFRARED]: -1
    }
  }

  id: string | number
  device: rs2.Device
  sensors: RealsenseCameraSensor[]

  constructor(id, device) {
    this.id = id
    this.device = device
    this.sensors = this.device?.querySensors().map(sensor => new RealsenseCameraSensor(id, sensor))
  }

  dispose() {
    this.sensors.forEach(sensor => sensor.dispose())
  }

  getSensorByName(name): RealsenseCameraSensor {
    return this.sensors.find(sensor => sensor.name == name)
  }

  findSensorSupportingStream(streamName) {
    return this.sensors.find(sensor => sensor.info.streams.find(stream => stream.stream == streamName))
  }
}
