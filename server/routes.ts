import koaBodyParser from 'koa-bodyparser'
import { CameraStreamer } from './controllers/camera-streamer'

process.on('bootstrap-module-history-fallback' as any, (app, fallbackOption) => {
  /*
   * fallback white list를 추가할 수 있다
   *
   * ex)
   * var paths = [
   *   'camera-stream'
   * ]
   * fallbackOption.whiteList.push(`^\/(${paths.join('|')})($|[/?#])`)
   */
  var paths = ['camera-stream']
  fallbackOption.whiteList.push(`^\/(${paths.join('|')})($|[/?#])`)
})

process.on('bootstrap-module-route' as any, (app, routes) => {
  routes.all(
    '/camera-stream/:type/:device/:stream/:index',
    koaBodyParser({
      formLimit: '10mb',
      jsonLimit: '10mb',
      textLimit: '10mb'
    }),
    async (context, next) => {
      const {
        params: { type, device, stream, index }
      } = context

      try {
        var body = context.request.body
        var query = context.request.query

        var command = {
          ...query,
          ...body
        }

        console.log('command', command)
        var driver = CameraStreamer.getCameraDriver(type)
        context.body = await driver.handleRequest({ type, device, stream, index, command })

        await next()
      } catch (e) {
        console.error(e)
      }
    }
  )
})
