export * from './entities'
export * from './migrations'
export * from './graphql'

import './middlewares'
import './routes'
import './engine'

process.on('bootstrap-module-start' as any, async ({ app, config, client }: any) => {})
