// Realsense Camera Video Streaming Protocol Client Module
export class WebcamClient {
  url
  socket
  callback
  deviceId

  constructor(deviceId, callback) {
    var protocol = location.protocol == 'http:' ? 'ws:' : 'wss:'
    this.url = `${protocol}//localhost:3001/camera-stream/realsense/${deviceId}/0/0`

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
}
