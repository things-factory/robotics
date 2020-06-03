import { expect } from 'chai'
import http from 'http'
import Koa from 'koa'
import Router from 'koa-router'
import request from 'request-promise'
import WebSocket from 'ws'
import url from 'url'

import cameraStreamer from '../../server/engine/connector/camera-streamer-koa-middleware'
/* to register simple stream driver */
import '../../server/engine/connector/camera-stream-driver-impl'

const app = new Koa()

const server = http.createServer(app.callback())
app.use(
  cameraStreamer({
    streamerProperty: 'streamer',
    websocketProperty: 'websocket',
    channelParser: function (request) {
      var [type = '', device = '', stream = '', index = ''] = url
        .parse(request.url)
        .pathname.substr('/camera-stream'.length + 1)
        .split('/')

      return {
        type,
        device,
        stream,
        index,
        channel: `${type}:${device}:${stream}:${index}`
      }
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
      // socket.send('hello there')
      var { channel } = streamer.getChannel(context.request)
      streamer.publish('hello there', channel)
    } else {
      context.body = 'hello there'
    }

    await next()
  } catch (e) {
    console.error(e)
  }
})

app.use(router.routes())
app.use(router.allowedMethods())

var address

describe('CameraStreamerMiddleware', function () {
  before(async function () {
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
  })

  it('should reply to websocket in case of websocket connection', async function () {
    await new Promise((resolve, reject) => {
      const client = new WebSocket(`ws://${address}/camera-stream/simple/0/color/0`)

      client.on('message', data => {
        expect(data).to.equal('hello there')

        client.close()
        resolve()
      })
    })
  })

  it('should still handle http', async function () {
    const reply = await request(`http://${address}/camera-stream/simple/0/color/0`)
    expect(reply).to.equal('hello there')
  })
})
