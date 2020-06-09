import http from 'http'
import url from 'url'
import Koa from 'koa'
import koaBodyParser from 'koa-bodyparser'
import Router from 'koa-router'

import './controllers/camera-streamer'
import { Realsense } from './controllers/realsense'
import cameraStreamer from './middlewares/camera-streamer-koa-middleware'

export class StreamingServer {
  start(port) {
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

    router.all(
      '/camera-stream/:type/:device/:stream/:index',
      koaBodyParser({
        formLimit: '10mb',
        jsonLimit: '10mb',
        textLimit: '10mb'
      }),
      async (context, next) => {
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
            var body = context.request.body
            var query = context.request.query

            var command = {
              ...query,
              ...body
            }

            console.log('command', command)
            context.body = await streamer.handleRequest({ type, device, stream, index, command })
          }

          await next()
        } catch (e) {
          console.error(e)
        }
      }
    )

    koaapp.use(router.routes())
    koaapp.use(router.allowedMethods())

    koaapp.listen(port)
  }
}
