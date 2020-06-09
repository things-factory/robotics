import './middlewares'
import './routes'
import './engine'

import { config as SystemConfig } from '@things-factory/env'
import { StreamingServer } from './streaming-server'

const DEFAULT_STREAMING_PORT = 3001

process.on('bootstrap-module-start' as any, async ({ app, config, client }: any) => {
  var visionConfig = SystemConfig.get('vision', {})
  var streamingServer = new StreamingServer()
  streamingServer.start(visionConfig.streamingPort || DEFAULT_STREAMING_PORT)
})
