import { CameraClient } from '../camera-client'

export class RealsenseClient extends CameraClient {
  constructor(port, deviceId, profile, callback) {
    super(port, 'realsense', deviceId, profile, callback)
  }

  commandCameraSetting(setting) {
    this.send({
      tag: 'camera-setting',
      data: {
        setting
      }
    })
  }

  commandSensorSetting(sensor, setting) {
    this.send({
      tag: 'sensor-setting',
      data: {
        sensor,
        setting
      }
    })
  }

  commandStartStream(sensor, streams, setting) {
    this.send({
      tag: 'start-stream',
      data: {
        sensor,
        streams,
        setting
        //   resolution: ,
        //   format: ,
        //   fps:
      }
    })
  }

  commandStopStream(sensor, streams) {
    this.send({
      tag: 'stop-stream',
      data: {
        sensor,
        streams
      }
    })
  }

  send(command) {
    this.socket.send(JSON.stringify(command))
  }
}
