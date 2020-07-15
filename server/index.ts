import './routes'
import './engine'

export * from './graphql'
export * from './controllers/robotics-types'

process.on('bootstrap-module-start' as any, async ({ app, config, client }: any) => {})
