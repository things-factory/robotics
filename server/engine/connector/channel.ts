import url from 'url'
import Debug from 'debug'
const debug = Debug('things-factory:vision-base:channel')

export default class Channel {
  static fromParser(made, request): { type; device; stream; index; channel } {
    var { type = '', device = '', stream = '', index = '' } = made(request)

    return {
      type,
      device,
      stream,
      index,
      channel: `${type}:${device}:${stream}:${index}`
    }
  }

  static fromChannel(channel): { type; device; stream; index } {
    var [type = '', device = '', stream = '', index = ''] = channel.split(':')
    return { type, device, stream, index }
  }

  static DEFAULT_CHANNEL_PARSER(request) {
    var [type = '', device = '', stream = '', index = ''] = url.parse(request.url).pathname.substr(1).split('/')

    debug('DEFAULT_CHANNEL_PARSER', 'type:', type, ', device:', device, ', stream:', stream, ', index:', index)

    return {
      type,
      device,
      stream,
      index,
      channel: `${type}:${device}:${stream}:${index}`
    }
  }
}
