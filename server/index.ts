export * from './entities'
export * from './migrations'
export * from './graphql'

import './middlewares'
import './routes'
import './engine'

import websockify from './middlewares/realsense-stream-middleware'
import Router from 'koa-router'
// import { statSync, createReadStream } from 'fs'
import { RealsenseServer } from './engine/connector/realsense-server/realsense-server'

// import websocket from './middlewares/websocket-middleware'
const Koa = require('koa')

process.on('bootstrap-module-start' as any, async ({ app, config, client }: any) => {
  /* Streaming over WEBSocket */
  const koaapp = new Koa()

  const wsapp = websockify(koaapp)
  const wsrouter = new Router()
  const wsOptions = {}

  // Regular middleware
  // Note it's app.ws.use and not app.use
  wsapp.ws.use(function (ctx, next) {
    // return `next` to pass the context (ctx) on to the next ws middleware
    return next(ctx)
  })

  wsapp.ws.use(
    // wss://host:ip/camera-stream/:dev
    wsrouter
      .all('/camera-stream/:dev', async (context, next) => {
        const {
          websocket,
          params: { dev }
        } = context
        console.log('--------------- routed ----------------', dev)
        try {
          var server = new RealsenseServer(Number(dev), websocket)
          websocket.on('message', message => {
            console.log('--------------- message ----------------', message)
            server.handleCommand(JSON.parse(message))
          })
          websocket.on('close', () => {
            console.log('--------------- closed ----------------')
          })

          return await next()
        } catch (e) {
          console.error(e)
        }
      })
      .routes()
  )

  koaapp.listen(3001)
})
