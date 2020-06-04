import { CameraStreamDriver } from './camera-stream-driver'
import { CameraStreamer } from './camera-streamer'

import Debug from 'debug'
const debug = Debug('things-factory:vision-base:camera-stream-driver-impl')

export class CameraStreamDriverSimple implements CameraStreamDriver {
  private streams = {}

  subscribe(type, device, profile, socket) {
    var { stream, index } = profile
    var channel = `${type}:${device}:${stream}:${index}`
    debug('subscribe', channel)

    var streams = this.streams[channel]
    if (streams) {
      streams.push(socket)
    } else {
      this.streams[channel] = [socket]
    }

    return {
      channel,
      socket
    }
  }

  unsubscribe(subscription) {
    var { channel, socket } = subscription
    debug('unsubscribe', channel)

    var streams = this.streams[channel]
    if (streams) {
      streams.splice(streams.indexOf(socket), 1)
    } else {
      delete this.streams[channel]
    }
  }

  publish(message, channel) {
    debug('publish', channel)
    this.streams[channel]?.forEach(socket => socket.send(message))
  }
}

CameraStreamer.registerCameraDriver('simple', new CameraStreamDriverSimple())
