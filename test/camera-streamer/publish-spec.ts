import { expect } from 'chai'
import { CameraStreamer } from '../../server/controllers/camera-streamer/camera-streamer'
/* to register simple stream driver */
import '../../server/controllers/camera-streamer/camera-stream-driver-simple'
import WebSocket from 'ws'

describe('CameraStreamer', function () {
  var cameraStreamer

  before(function () {
    cameraStreamer = new CameraStreamer(
      { port: 0, path: '/simple/foo' },
      {
        connectedCallback: (socket, request) => {
          var { channel } = cameraStreamer.getChannel(request)
          console.log('**** channel ****', channel)
          cameraStreamer.publish('hello streamer', channel)
        }
      }
    )
  })

  after(function () {
    cameraStreamer.despose()
  })

  describe('publish', function () {
    it('should send to all websocket client', done => {
      const port = cameraStreamer.wss.address().port
      const ws1 = new WebSocket(`ws://localhost:${port}/simple/foo`)
      const ws2 = new WebSocket(`ws://localhost:${port}/simple/foo`)

      var count = 0
      function onmessage(message) {
        this.close()
        ++count == 2 && done()
      }

      ws1.on('message', onmessage)
      ws2.on('message', onmessage)
    })
  })
})
