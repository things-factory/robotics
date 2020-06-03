import rs2 from '@things-factory/node-librealsense2'
import sharp from 'sharp'

import { SENSOR, STREAM, Profile } from './realsense-const'
import { RealsenseCamera } from './realsense-camera'
import { RealsenseCameraSensor } from './realsense-camera-sensor'

import Debug from 'debug'
const debug = Debug('things-factory:vision-base:realsense')

const JPEG_QUALITY = 40

export class Realsense {
  static colorizer
  static decimate
  static context
  static _devices
  static _subscriptions: {
    [channel: string]: { id: string; device: string | number; sensor: string; callback: any }[]
  } = {}

  static get devices(): rs2.Device[] {
    if (!Realsense._devices) {
      Realsense._devices = Realsense.context
        .queryDevices()
        .devices.map((device, index) => new RealsenseCamera(index, device))
    }
    return Realsense._devices
  }

  static init() {
    Realsense.colorizer = new rs2.Colorizer()
    Realsense.decimate = new rs2.DecimationFilter()
    Realsense.context = new rs2.Context()
  }

  static cleanup() {
    Realsense.devices.forEach(device => device.dispose())
    delete Realsense._devices

    rs2.cleanup()
  }

  static get presets() {
    var presets = []

    for (let p in rs2.rs400_visual_preset) {
      if (typeof rs2.rs400_visual_preset[p] === 'string') {
        presets.push(rs2.rs400_visual_preset[p])
      }
    }

    return presets
  }

  static getDevice(index): RealsenseCamera {
    return Realsense.devices[index]
  }

  static _buildChannel(device, sensor, stream, index) {
    return `${device}:${sensor}:${stream}:${index}`
  }

  static async _callback(frame, context: { device: string | number; sensor: RealsenseCameraSensor }) {
    var info = await Realsense.buildFrameInfo(frame)
    var { stream, index } = info.meta
    var channel = Realsense._buildChannel(context.device, context.sensor.name, stream, index)

    debug('callback', channel)

    var subscriptionsForChannel = Realsense._subscriptions[channel]
    if (!subscriptionsForChannel) {
      return
    }

    subscriptionsForChannel.forEach(subscription => subscription.callback(info))
  }

  static subscribe(device: string | number, profile: Profile, callback): string {
    var sensor = Realsense.getDevice(device).findSensorSupportingStream(profile.stream)

    if (!sensor) {
      debug(`no sensor for the profile(${profile.stream}:${profile.index}) of the device(${device})`)
      return
    }

    sensor.start(profile, Realsense._callback)

    var channel = Realsense._buildChannel(device, sensor.name, profile.stream, profile.index)
    var id = channel + ':' + Date.now()

    var subscriptionsForChannel = Realsense._subscriptions[channel]
    if (!subscriptionsForChannel) {
      Realsense._subscriptions[channel] = subscriptionsForChannel = []
    }

    subscriptionsForChannel.push({
      id,
      device,
      sensor: sensor.name,
      callback
    })

    return id
  }

  static unsubscribe(subscription: string) {
    var [device, sensor, stream, index] = subscription.split(':')
    var channel = Realsense._buildChannel(device, sensor, stream, index)

    var subscriptionsForChannel = Realsense._subscriptions[channel]
    if (!subscriptionsForChannel) {
      debug(`FIX-YOURS - no channels for given subscription(${subscription})`)
      return
    }

    subscriptionsForChannel = subscriptionsForChannel.filter(s => s.id != subscription)
    if (subscriptionsForChannel.length == 0) {
      delete Realsense._subscriptions[channel]

      if (Object.keys(Realsense._subscriptions).filter(key => key.indexOf('device:sensor') == 0).length == 0) {
        debug(`stop sensor(${device}:${sensor})`)
        Realsense.getDevice(device)?.getSensorByName(sensor).stop()
      }
    }
  }

  static publish(message, channel) {
    var subscriptionsForChannel = Realsense._subscriptions[channel]
    if (!subscriptionsForChannel) {
      Realsense._subscriptions[channel] = subscriptionsForChannel = []
    }

    subscriptionsForChannel.forEach(subscription => subscription.callback(message))
  }

  static async buildFrameInfo(frame) {
    const { streamType, width, height, streamIndex, format } = frame

    if (streamType === rs2.stream.STREAM_COLOR) {
      const data = await sharp(Buffer.from(frame.data.buffer), {
        raw: {
          width: width,
          height: height,
          channels: 3
        }
      })
        .jpeg({
          quality: JPEG_QUALITY
        })
        .toBuffer()

      return {
        meta: {
          stream: rs2.stream.streamToString(streamType),
          index: frame.profile.streamIndex,
          format: rs2.format.formatToString(format),
          width: width,
          height: height
        },
        data
      }
    } else if (streamType === rs2.stream.STREAM_DEPTH) {
      const depthMap = this.colorizer.colorize(frame)

      const data = await sharp(Buffer.from(depthMap.data.buffer), {
        raw: {
          width: width,
          height: height,
          channels: 3
        }
      })
        .jpeg({
          quality: JPEG_QUALITY
        })
        .toBuffer()

      return {
        meta: {
          stream: rs2.stream.streamToString(streamType),
          index: frame.profile.streamIndex,
          format: rs2.format.formatToString(format),
          width: width,
          height: height
        },
        data
      }
    } else if (streamType === rs2.stream.STREAM_INFRARED) {
      const infraredFrame = this.decimate.process(frame)

      return {
        meta: {
          stream: rs2.stream.streamToString(streamType),
          index: frame.profile.streamIndex,
          format: rs2.format.formatToString(format),
          width: infraredFrame.width,
          height: infraredFrame.height
        },
        data: infraredFrame.data,
        frame: infraredFrame
      }
    }
  }
}
