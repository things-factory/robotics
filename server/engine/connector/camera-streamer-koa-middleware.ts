import { CameraStreamer } from './camera-streamer'

import Debug from 'debug'
const debug = Debug('things-factory:vision-base:camera-streamer-koa-middleware')

export default function cameraStreamer(options) {
  const {
    streamerProperty = 'streamer',
    websocketProperty = 'websocket',
    connectedCallback,
    closedCallback,
    channelParser
  } = options

  debug(`websocket middleware created with property name '${websocketProperty}'`)

  const cameraStreamer = new CameraStreamer(
    { noServer: true },
    {
      connectedCallback,
      closedCallback,
      channelParser
    }
  )

  const wss = cameraStreamer.wss

  const websocketMiddleware = async (context, next) => {
    debug(`websocket middleware called on route ${context.path}`)

    context[streamerProperty] = cameraStreamer

    const upgradeHeader = (context.request.headers.upgrade || '').split(',').map(s => s.trim())

    if (~upgradeHeader.indexOf('websocket')) {
      debug(`websocket middleware in use on route ${context.path}`)

      context[websocketProperty] = () =>
        new Promise(resolve => {
          wss.handleUpgrade(context.req, context.request.socket, Buffer.alloc(0), ws => {
            /* websocket으로 upgrade 된 경우에도 onconnection 로직을 실행하도록 한다. */
            cameraStreamer.onconnection(ws, context.request)
            context.respond = false

            resolve(ws)
          })
        })
    }

    await next()
  }

  return websocketMiddleware
}
