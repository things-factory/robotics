import websockify from 'koa-websocket'
import Router from 'koa-router'
import { statSync, createReadStream } from 'fs'
import { RealsenseServer } from './engine/connector/realsense/realsense-server'

const wsOptions = {}

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
  var paths = ['test']
  fallbackOption.whiteList.push(`^\/(${paths.join('|')})($|[/?#])`)
})

process.on('bootstrap-module-route' as any, (app, routes) => {
  /*
   * koa application에 routes 를 추가할 수 있다.
   *
   * ex) routes.get('/path', async(context, next) => {})
   * ex) routes.post('/path', async(context, next) => {})
   */

  routes.get('/video', function (req, res) {
    const path = 'assets/sample.mp4'
    const stat = statSync(path)
    const fileSize = stat.size
    const range = req.headers.range

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-')
      const start = parseInt(parts[0], 10)
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
      const chunksize = end - start + 1
      const file = createReadStream(path, { start, end })
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4'
      }
      res.writeHead(206, head)
      file.pipe(res)
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4'
      }
      res.writeHead(200, head)
      createReadStream(path).pipe(res)
    }
  })

  /* Streaming over WEBSocket */
  const wsapp = websockify(app, wsOptions)
  const wsrouter = new Router()

  wsapp.ws.use(
    // wss://host:ip/camera-stream/:id
    wsrouter
      .all('/camera-stream/:dev', context => {
        const {
          websocket,
          params: { dev }
        } = context

        var server = new RealsenseServer(Number(dev), websocket)

        websocket.on('message', message => {
          server.handleCommand(JSON.parse(message))
        })
      })
      .routes()
  )
})
