// Realsense Camera Video Streaming Protocol Client Module
export class RealsenseClient {
  url
  socket
  callback

  constructor(cameraId, callback) {
    this.url = 'ws://' + window.location.host + '/camera-stream/' + cameraId

    this.socket = null
    this.callback = callback
  }

  connect() {
    this.socket = new WebSocket(this.url)

    this.socket.addEventListener('open', event => {})

    this.socket.addEventListener('message', event => {
      var { data } = event
      this.callback(data)
    })
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
