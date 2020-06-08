// Web Camera Video Streaming Protocol Client Module
export class WebcamClient {
  url
  socket
  callback
  deviceId

  constructor(deviceId, callback) {
    var protocol = location.protocol == 'http:' ? 'ws:' : 'wss:'
    this.url = `${protocol}//${window.location.hostname}:3001/camera-stream/webcam/${deviceId}/0/0`

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
      // this.callback('data:image/jpeg;base64,' + message.data)
      this.callback(data)
    }
  }

  disconnect() {
    this.socket.close()
  }
}
