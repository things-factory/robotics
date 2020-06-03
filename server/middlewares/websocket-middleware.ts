const http = require('http')
const WebSocket = require('ws')

const serversPatched = new WeakSet()

export default function createWebsocketMiddleware(propertyName = 'ws', options?) {
  if (!options) options = {}
  if (options instanceof http.Server) options = { server: options }

  if (parseInt(process.versions.node) < 10 && !options.noServerWorkaround) {
    // node 9 or earlier needs a workaround for upgrade requests
    if (!options.server) {
      throw new TypeError(
        `
        If you target Node 9 or earlier you must provide the HTTP server either as an option or as the second parameter.
        See the readme for more instructions: https://github.com/b3nsn0w/koa-easy-ws#special-usage-for-node-9-or-earlier
      `
          .trim()
          .split('\n')
          .map(s => s.trim())
          .join('\n')
      )
    } else {
      if (!serversPatched.has(options.server)) {
        serversPatched.add(options.server)
        options.server.on('upgrade', req => options.server.emit('request', req, new http.ServerResponse(req)))
        console.log('****************', 'added workaround to a server')
      }
    }
  }

  console.log('****************', `websocket middleware created with property name '${propertyName}'`)
  const wss = new WebSocket.Server({ noServer: true })

  const websocketMiddleware = async (ctx, next) => {
    console.log('****************', `websocket middleware called on route ${ctx.path}`)
    const upgradeHeader = (ctx.request.headers.upgrade || '').split(',').map(s => s.trim())

    if (~upgradeHeader.indexOf('websocket')) {
      console.log('=========================', `websocket middleware in use on route ${ctx.path}`)
      ctx[propertyName] = () =>
        new Promise(resolve => {
          console.log('++++++++++++++++++++++++', `websocket middleware in use on route ${ctx.path}`)
          wss.handleUpgrade(ctx.req, ctx.request.socket, Buffer.alloc(0), resolve)
          ctx.respond = false
        })
    }

    await next()
  }

  websocketMiddleware.server = wss
  return websocketMiddleware
}
