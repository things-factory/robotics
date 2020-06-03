// import websockify from './middlewares/realsense-stream-middleware'
// import Router from 'koa-router'
// import { statSync, createReadStream } from 'fs'
// import { RealsenseServer } from './engine/connector/realsense/realsense-server'

// import websocket from './middlewares/websocket-middleware'

// const wsOptions = {}

process.on('bootstrap-module-history-fallback' as any, (app, fallbackOption) => {
  /*
   * fallback white list를 추가할 수 있다
   *
   * ex)
   * var paths = [
   *   'aaa',
   *   'bbb'
   * ]
   * fallbackOption.whiteList.push(`^\/(${paths.join('|')})($|[/?#])`)
   */
})

process.on('bootstrap-module-route' as any, (app, routes) => {
  // app.use(websocket('zzzzzz'))
  // routes.all('/camera-stream/:dev', async (context, next) => {
  //   const {
  //     zzzzzz,
  //     params: { dev }
  //   } = context
  //   try {
  //     console.log('--------------- routed ----------------', dev)
  //     var websocket = await zzzzzz()
  //     var server = new RealsenseServer(Number(dev), websocket)
  //     // await server.sendCommand({
  //     //   tag: 'abc',
  //     //   data: {
  //     //     x: 100
  //     //   }
  //     // })
  //     websocket.on('message', message => {
  //       console.log('--------------- message ----------------', message)
  //       server.handleCommand(JSON.parse(message))
  //     })
  //     await next()
  //   } catch (e) {
  //     console.error('==========================================', e)
  //   }
  // })
  /*
   * koa application에 routes 를 추가할 수 있다.
   *
   * ex) routes.get('/path', async(context, next) => {})
   * ex) routes.post('/path', async(context, next) => {})
   */
  // routes.get('/video', function (req, res) {
  //   const path = 'assets/sample.mp4'
  //   const stat = statSync(path)
  //   const fileSize = stat.size
  //   const range = req.headers.range
  //   if (range) {
  //     const parts = range.replace(/bytes=/, '').split('-')
  //     const start = parseInt(parts[0], 10)
  //     const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
  //     const chunksize = end - start + 1
  //     const file = createReadStream(path, { start, end })
  //     const head = {
  //       'Content-Range': `bytes ${start}-${end}/${fileSize}`,
  //       'Accept-Ranges': 'bytes',
  //       'Content-Length': chunksize,
  //       'Content-Type': 'video/mp4'
  //     }
  //     res.writeHead(206, head)
  //     file.pipe(res)
  //   } else {
  //     const head = {
  //       'Content-Length': fileSize,
  //       'Content-Type': 'video/mp4'
  //     }
  //     res.writeHead(200, head)
  //     createReadStream(path).pipe(res)
  //   }
  // })
  /* Streaming over WEBSocket */
  // const wsapp = websockify(app)
  // const wsrouter = new Router()
  // // Regular middleware
  // // Note it's app.ws.use and not app.use
  // wsapp.ws.use(function (ctx, next) {
  //   // return `next` to pass the context (ctx) on to the next ws middleware
  //   return next(ctx)
  // })
  // wsapp.ws.use(
  //   // wss://host:ip/camera-stream/:dev
  //   wsrouter
  //     .all('/camera-stream/:dev', async (context, next) => {
  //       const {
  //         websocket,
  //         params: { dev }
  //       } = context
  //       console.log('--------------- routed ----------------', dev)
  //       try {
  //         // websocket.handleUpgrade(context.req, context.request.socket, Buffer.alloc(0), () => {
  //         var server = new RealsenseServer(Number(dev), websocket)
  //         websocket.on('message', message => {
  //           console.log('--------------- message ----------------', message)
  //           server.handleCommand(JSON.parse(message))
  //         })
  //         websocket.on('close', () => {
  //           console.log('--------------- closed ----------------')
  //         })
  //         // })
  //         return await next()
  //       } catch (e) {
  //         console.error(e)
  //       }
  //     })
  //     .routes()
  // )
})
