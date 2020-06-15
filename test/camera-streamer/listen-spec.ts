import { expect } from 'chai'
import { CameraStreamer } from '../../server/controllers/camera-streamer/camera-streamer'
import WebSocket from 'ws'
/* to register simple stream driver */
import '../../server/controllers/camera-streamer/camera-stream-driver-simple'

describe('CameraStreamer', function () {
  var cameraStreamer

  before(function () {
    cameraStreamer = new CameraStreamer({ port: 0, path: '/simple/foo' })
  })

  after(function () {
    cameraStreamer.dispose()
  })

  describe('listen', function () {
    it('should connectable from websocket client', done => {
      const port = cameraStreamer.wss.address().port
      const ws = new WebSocket(`ws://localhost:${port}/simple/foo`)

      ws.onopen = e => {
        expect(ws.url).equals(`ws://localhost:${port}/simple/foo`)

        ws.onclose = function () {
          done()
        }
        ws.close()
      }
    })
  })
})
