import { expect } from 'chai'
import { CameraStreamer } from '../../server/engine/connector/camera-streamer'
import WebSocket from 'ws'

describe('CameraStreamer', function () {
  var cameraStreamer

  before(function () {
    cameraStreamer = new CameraStreamer({ port: 0, path: '/foo' })
  })

  after(function () {
    cameraStreamer.despose()
  })

  describe('listen', function () {
    it('should connectable from websocket client', done => {
      const port = cameraStreamer.wss.address().port
      const ws = new WebSocket(`ws://localhost:${port}/foo`)

      ws.onopen = e => {
        expect(ws.url).equals(`ws://localhost:${port}/foo`)

        ws.onclose = function () {
          done()
        }
        ws.close()
      }
    })
  })
})
