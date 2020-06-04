export * from './entities'
export * from './migrations'
export * from './graphql'

import './middlewares'
import './routes'
import './engine'

import http from 'http'
import url from 'url'
import Koa from 'koa'
import Router from 'koa-router'

import { Realsense } from './engine/connector/realsense'
import cameraStreamer from './engine/connector/camera-streamer-koa-middleware'

process.on('bootstrap-module-start' as any, async ({ app, config, client }: any) => {
  /* Streaming over WEBSocket */
  Realsense.init()
  const koaapp = new Koa()

  const server = http.createServer(koaapp.callback())
  const router = new Router()

  koaapp.use(
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
        // var { channel } = streamer.getChannel(context.request)
        // streamer.publish('hello there', channel)
      } else {
        context.body = 'hello there'
      }

      await next()
    } catch (e) {
      console.error(e)
    }
  })

  koaapp.use(router.routes())
  koaapp.use(router.allowedMethods())

  koaapp.listen(3001)
})
