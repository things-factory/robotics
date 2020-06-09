import { expect } from 'chai'
import http from 'http'
import Koa from 'koa'
import Router from 'koa-router'
import request from 'request-promise'
import WebSocket from 'ws'
import url from 'url'
import { Realsense, SENSOR } from '../../server/controllers/realsense'

import cameraStreamer from '../../server/middlewares/camera-streamer-koa-middleware'
import '../../server/controllers/camera-streamer/camera-stream-driver-realsense'

describe('get-setting', function () {
  var server
  var address

  this.timeout(10000)

  before(async function () {
    Realsense.init()

    const app = new Koa()

    server = http.createServer(app.callback())
    app.use(
      cameraStreamer({
        streamerProperty: 'streamer',
        websocketProperty: 'websocket',
        channelParser: function (request) {
          // var [type = '', device = '', stream = '', index = ''] = url
          //   .parse(request.url)
          //   .pathname.substr('/camera-stream'.length + 1)
          //   .split('/')
          // return {
          //   type,
          //   device,
          //   stream,
          //   index,
          //   channel: `${type}:${device}:${stream}:${index}`
          // }
        }
      })
    )

    const router = new Router()
    router.all('/camera-stream/:type/:device/:stream/:index', async (context, next) => {
      const {
        streamer,
        websocket,
        params: { type, device, stream, index }
      } = context

      try {
        if (websocket) {
          var socket = await websocket()
        } else {
          context.body = await streamer.handleRequest({ type, device, stream, index }, context.request)
        }

        await next()
      } catch (e) {
        console.error(e)
      }
    })

    app.use(router.routes())
    app.use(router.allowedMethods())

    return new Promise((resolve, reject) => {
      server.listen()
      server.once('listening', function () {
        const serverAddress = server.address()
        const port = serverAddress['port']
        address = `localhost:${port}`
        resolve()
      })
    })
  })

  after(function () {
    server.close()

    Realsense.cleanup()
  })

  // it('should reply to websocket in case of websocket connection', async function () {
  //   await new Promise((resolve, reject) => {
  //     const client = new WebSocket(`ws://${address}/camera-stream/realsense/0/color/0`)

  //     client.on('message', data => {
  //       expect(data).to.equal('hello there')

  //       client.close()
  //       resolve()
  //     })
  //   })
  // })

  it('should still handle http', async function () {
    const reply = await request({
      method: 'POST',
      uri: `http://${address}/camera-stream/realsense/0/color/0`,
      body: {
        tag: 'get-setting'
      },
      headers: {
        'User-Agent': 'Request-Promise'
      },
      json: true
    })

    var exposure = reply.find(option => option.option == 'exposure')
    console.log(exposure)
    expect(exposure).to.not.undefined
  })
})
