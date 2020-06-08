export class CameraClient {
  url
  socket
  callback
  deviceId

  constructor(port, cameraType, deviceId, profile, callback) {
    var protocol = location.protocol == 'http:' ? 'ws:' : 'wss:'
    var { stream = '0', index = '0' } = profile

    this.url = `${protocol}//${window.location.hostname}:${port}/camera-stream/${cameraType}/${deviceId}/${stream}/${index}`

    this.socket = null
    this.deviceId = deviceId
    this.callback = callback
  }

  connect() {
    this.socket = new WebSocket(this.url)

    this.socket.addEventListener('open', event => {
      console.log('websocket open', event)
    })

    this.socket.onmessage = message => {
      var { data } = message
      this.callback(data)
    }
  }

  disconnect() {
    this.socket.close()
  }
}
