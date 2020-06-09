import Debug from 'debug'
const debug = Debug('things-factory:vision-base:realsense-stream-driver')

import { CameraStreamDriver } from './camera-stream-driver'
import { CameraStreamer } from './camera-streamer'
import { Realsense } from '../realsense'
import { ClientRequest } from 'http'

export class RealsenseStreamDriver implements CameraStreamDriver {
  subscribe(type, device, profile, socket) {
    debug('subscribe')
    return Realsense.subscribe(device, profile, (frame, count) => this.sendFrame(socket, frame, count))
  }

  unsubscribe(subscription) {
    debug('unsubscribe')
    Realsense.unsubscribe(subscription)
  }

  publish(message, channel) {
    debug('publish')
    Realsense.publish(message, channel)
  }

  handleRequest(request) {
    var { tag } = request.command

    switch (tag) {
      case 'get-setting':
        return this.handleGetSetting(request)
        break
      case 'set-setting':
        return this.handleSetSetting(request)
        break
      // case 'start-stream':
      //   this.handleStartStream(request)
      //   break
      // case 'stop-stream':
      //   this.handleStopStream(request)
      //   break
      default:
        debug(`Unrecognized request ${tag}`)
        return {
          error: `Unrecognized request ${tag}`
        }
        break
    }
  }

  handleGetSetting(request) {
    const { device, stream } = request

    var sensor = Realsense.getDevice(device).findSensorSupportingStream(stream)
    return sensor.options
  }

  handleSetSetting(request) {
    const { device, stream, command } = request

    const { setting } = command

    var sensor = Realsense.getDevice(device).findSensorSupportingStream(stream)

    debug('handleSetSetting', command)
    for (let option in setting) {
      sensor.setOption(option, Number(setting[option]))
    }

    return sensor.options
  }

  // handleStartStream(request) {
  //   const {
  //     tag,
  //     data: { device, profile }
  //   } = request

  //   this.subscribe(device, profile)
  //   Realsense.subscribe(device, profile, frame => {
  //     this.sendFrame(frame)
  //   })

  //   const sensor = this._findSensorByName(sensorName)
  //   debug('sensor', sensor)
  //   const profiles = this._findMatchingProfiles(sensor, streams)

  //   if (profiles && sensor) {
  //     debug('open profiles:', profiles)

  //     sensor.open(profiles)
  //     var count = 0
  //     sensor.start(async frame => {
  //       const frameInfo = await this._processFrameBeforeSend(frame)
  //       this.sendFrame(frameInfo, count++ == 0)
  //     })
  //   }
  // }

  // handleStopStream(request) {
  //   const {
  //     tag,
  //     data: { sensor: sensorName }
  //   } = request
  //   let sensor = this._findSensorByName(sensorName)

  //   if (sensor) {
  //     sensor.stop()
  //     sensor.close()
  //   }
  // }

  sendFrame(socket, frameInfo, count) {
    const { meta, data } = frameInfo

    !count && socket.send(JSON.stringify(meta))
    socket.send(data)
  }

  // sendrequest(request) {
  //   socket.send(JSON.stringify(request))
  // }
}

CameraStreamer.registerCameraDriver('realsense', new RealsenseStreamDriver())
