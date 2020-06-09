export class CameraClient {
  wsUrl
  httpUrl
  socket
  callback
  deviceId

  constructor(port, cameraType, deviceId, profile, callback) {
    var protocol = location.protocol == 'http:' ? 'ws:' : 'wss:'
    var { stream = '0', index = '0' } = profile

    this.wsUrl = `${protocol}//${window.location.hostname}:${port}/camera-stream/${cameraType}/${deviceId}/${stream}/${index}`
    this.httpUrl = `${location.protocol}//${window.location.host}/camera-stream/${cameraType}/${deviceId}/${stream}/${index}`

    this.socket = null
    this.deviceId = deviceId
    this.callback = callback
  }

  connect() {
    this.socket = new WebSocket(this.wsUrl)

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

  async sendRequest(command) {
    const response = await fetch(this.httpUrl, {
      method: 'POST',
      mode: 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(command)
    })

    return await response.json()
  }
}
