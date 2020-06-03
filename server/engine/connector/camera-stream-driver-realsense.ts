import WebSocket from 'ws'
import Debug from 'debug'
const debug = Debug('things-factory:vision-base:realsense-stream-driver')

import { CameraStreamDriver } from './camera-stream-driver'
import { Realsense } from './realsense'
import { CameraStreamer } from './camera-streamer'

type STREAMS = { [key: string]: WebSocket[] }

export class RealsenseStreamDriver implements CameraStreamDriver {
  subscribe(type, device, profile, socket) {
    debug('subscribe')
    return Realsense.subscribe(device, profile, frame => this.sendFrame(socket, frame))
  }

  unsubscribe(subscription) {
    debug('unsubscribe')
    Realsense.unsubscribe(subscription)
  }

  publish(message, channel) {
    debug('publish')
    Realsense.publish(message, channel)
  }

  // handleCommand(command) {
  //   switch (command.tag) {
  //     case 'sensor-setting':
  //       this.handleSensorSetting(command)
  //       break
  //     case 'start-stream':
  //       this.handleStartStream(command)
  //       break
  //     case 'stop-stream':
  //       this.handleStopStream(command)
  //       break
  //     default:
  //       debug(`Unrecognized command ${command}`)
  //       break
  //   }
  // }

  // handleSensorSetting(command) {
  //   const { device, setting, sensor: sensorName } = command.data

  //   var sensor = Realsense.devices[device].this._findSensorByName(sensorName)

  //   for (let option in setting) {
  //     sensor.setOption(option, Number(setting[option]))
  //   }
  // }

  // handleStartStream(command) {
  //   const {
  //     tag,
  //     data: { device, profile }
  //   } = command

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

  // handleStopStream(command) {
  //   const {
  //     tag,
  //     data: { sensor: sensorName }
  //   } = command
  //   let sensor = this._findSensorByName(sensorName)

  //   if (sensor) {
  //     sensor.stop()
  //     sensor.close()
  //   }
  // }

  sendFrame(socket, frameInfo) {
    const { meta, data } = frameInfo

    socket.send(JSON.stringify(meta))
    socket.send(data)
  }

  // sendCommand(command) {
  //   socket.send(JSON.stringify(command))
  // }
}

CameraStreamer.registerCameraDriver('realsense', new RealsenseStreamDriver())
