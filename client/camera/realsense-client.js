// Realsense Camera Video Streaming Protocol Client Module
export class RealsenseClient {
  url
  socket
  callback
  deviceId

  constructor(deviceId, profile, callback) {
    var protocol = location.protocol == 'http:' ? 'ws:' : 'wss:'
    var { stream, index } = profile
    // this.url = `${protocol}//${window.location.host}/camera-stream/${deviceId}`
    this.url = `${protocol}//localhost:3001/camera-stream/realsense/${deviceId}/${stream}/${index}`
    // this.url = `${protocol}//localhost:3001/camera-stream/realsense/${deviceId}/depth/0`

    this.socket = null
    this.deviceId = deviceId
    this.callback = callback
  }

  connect() {
    this.socket = new WebSocket(this.url)

    this.socket.addEventListener('open', event => {
      console.log('websocket open', event)
    })

    this.socket.addEventListener('message', event => {
      var { data } = event
      this.callback(data)
    })
  }

  disconnect() {
    this.socket.close()
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
