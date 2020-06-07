import { Connections } from '@things-factory/integration-base'

import { CameraStreamDriver } from './camera-stream-driver'
import { CameraStreamer } from './camera-streamer'
import { GstLiveCamServer } from './gstreamer/gst-livecam-server'

import Dicer from 'dicer'

import Debug from 'debug'
const debug = Debug('things-factory:vision-base:camera-stream-driver-webcam')

const gst_multipart_boundary: String = '--videoboundary'

export class CameraStreamDriverWebcam implements CameraStreamDriver {
  private streams = {}
  private livecams = {}

  subscribe(type, device, profile, socket) {
    var channel = `${type}:${device}`
    debug('subscribe', channel)

    var streams = this.streams[channel]
    if (streams) {
      streams.push(socket)
    } else {
      this.streams[channel] = [socket]

      var liveserver = new GstLiveCamServer({
        fake: false,
        width: 800,
        height: 600,
        framerate: 30,
        grayscale: false
      })

      this.livecams[channel] = liveserver

      liveserver.start()

      var dicer = new Dicer({ boundary: gst_multipart_boundary })

      dicer
        .on('part', function (part) {
          var frameEncoded = ''
          part.setEncoding('base64')

          part.on('data', function (data) {
            frameEncoded += data
          })
          part.on('end', function () {
            try {
              this.streams[channel].forEach(socket => socket.send(frameEncoded))
            } catch (e) {
              Connections.logger.error(e)
            }
          })
          part.on('error', function (err) {
            Connections.logger.error('error', err)
          })
        })
        .on('error', function (err) {
          Connections.logger.error('error', err)
        })

      dicer.on('finish', function () {
        Connections.logger.info('Dicer finished: ' + channel)
      })

      var gstProcess = this.livecams[channel].childProcess

      gstProcess.stdout.pipe(dicer)
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
      if (streams.length == 0) {
        var liveserver = this.livecams[channel]
        delete this.livecams[channel]
        liveserver.stop()
      }
    } else {
      delete this.streams[channel]
    }
  }

  publish(message, channel) {
    debug('publish', channel)
    this.streams[channel]?.forEach(socket => socket.send(message))
  }
}

CameraStreamer.registerCameraDriver('webcam', new CameraStreamDriverWebcam())
