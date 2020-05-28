import rs2 from '@things-factory/node-librealsense2'
import { ResponseTag } from './common'

import sharp from 'sharp'

const COLOR_SENSOR = 'RGB Camera'
const STEREO_SENSOR = 'Stereo Module'
const COLOR_STREAM = 'color'
const INFRARED_STREAM_1 = 'infrared1'
const INFRARED_STREAM_2 = 'infrared2'
const DEPTH_STREAM = 'depth'

const JPEG_QUALITY = 40

export class RealsenseServer {
  context: rs2.Context
  colorizer: rs2.Colorizer
  decimate: rs2.DecimationFilter
  device: rs2.Device
  sensors: rs2.Sensor[]

  socket: any

  constructor(dev, socket) {
    this.socket = socket

    this.colorizer = new rs2.Colorizer()
    this.decimate = new rs2.DecimationFilter()
    this.context = new rs2.Context()

    var devices = this.context.queryDevices()
    this.device = devices[dev]
    this.sensors = this.device.querySensors()
  }

  cleanup() {
    this.context = null
    this.sensors = null

    rs2.cleanup()
  }

  getDefaultConfig() {
    return {
      tag: ResponseTag.defaultCfg,
      data: {
        preset: 'custom',
        resolution: [
          [STEREO_SENSOR, '1280*720'],
          [COLOR_SENSOR, '1280*720']
        ],
        fps: [
          [STEREO_SENSOR, 30],
          [COLOR_SENSOR, 30]
        ],
        format: [
          [DEPTH_STREAM, 'z16'],
          [INFRARED_STREAM_1, 'y8'],
          [INFRARED_STREAM_2, 'y8'],
          [COLOR_STREAM, 'rgb8']
        ],
        streams: [DEPTH_STREAM, COLOR_STREAM, INFRARED_STREAM_1]
      }
    }
  }

  getPresets() {
    let presets = {
      tag: ResponseTag.presets,
      data: []
    }

    for (let p in rs2.rs400_visual_preset) {
      if (typeof rs2.rs400_visual_preset[p] === 'string') {
        presets.data.push(rs2.rs400_visual_preset[p])
      }
    }

    return presets
  }

  getAllSensorInfo() {
    if (!this.sensors) {
      return undefined
    }
    let info = {
      tag: ResponseTag.sensorInfo,
      data: []
    }

    this.sensors.forEach(s => {
      info.data.push(this._getSensorInfo(s))
    })
    return info
  }

  getOptions() {
    if (!this.sensors) {
      return undefined
    }

    var options = {
      tag: ResponseTag.options,
      data: {}
    }

    this.sensors.forEach(s => {
      let sensorName = s.getCameraInfo(rs2.camera_info.camera_info_name)
      options.data[sensorName] = this._getSensorOptions(s)
    })

    return options
  }

  handleCommand(command) {
    switch (command.tag) {
      case 'sensor-setting':
        this.handleSensorSetting(command)
        break
      case 'start-stream':
        this.handleStartStream(command)
        break
      case 'stop-stream':
        this.handleStopStream(command)
        break
      default:
        console.log(`Unrecognized command ${command}`)
        break
    }
  }

  handleSensorSetting(command) {
    const { setting, sensor: sensorName } = command.data

    var sensor = this._findSensorByName(sensorName)

    for (let option in setting) {
      sensor.setOption(option, Number(setting[option]))
    }
  }

  handleStartStream(command) {
    const {
      tag,
      data: { sensor: sensorName, streams }
    } = command

    const sensor = this._findSensorByName(sensorName)
    const profiles = this._findMatchingProfiles(sensor, streams)

    if (profiles && sensor) {
      console.log('open profiles:', profiles)

      sensor.open(profiles)
      sensor.start(async frame => {
        const frameInfo = await this._processFrameBeforeSend(frame)
        this.sendFrame(frameInfo)
      })
    }
  }

  handleStopStream(command) {
    const { tag, data } = command

    let sensor = this._findSensorByName(data.sensor)

    if (sensor) {
      sensor.stop()
      sensor.close()
    }
  }

  _getSensorInfo(sensor) {
    let info = {
      name: sensor.getCameraInfo(rs2.camera_info.camera_info_name),
      resolutions: [],

      fpses: [],
      streams: []
    }
    let streamMap = new Map()
    let profiles = sensor.getStreamProfiles()
    profiles.forEach(p => {
      // only cares about video stream profile
      if (!(p instanceof rs2.VideoStreamProfile)) {
        return
      }

      let found = info.resolutions.find(e => {
        return e.w === p.width && e.h === p.height
      })
      if (!found) {
        info.resolutions.push({ w: p.width, h: p.height })
      }
      found = info.fpses.find(fps => {
        return fps === p.fps
      })
      if (!found) {
        info.fpses.push(p.fps)
      }

      let streamName = rs2.stream.streamToString(p.streamType)
      let formatName = rs2.format.formatToString(p.format)
      let index = p.streamIndex
      let key = streamName + index

      if (!streamMap.has(key)) {
        streamMap.set(key, {
          index: index,
          name: streamName,
          formats: [formatName]
        })
      } else {
        let entry = streamMap.get(key)
        found = entry.formats.find(f => {
          return f === formatName
        })
        if (!found) {
          entry.formats.push(formatName)
        }
      }
    })
    streamMap.forEach((val, key) => {
      info.streams.push({
        index: val.index,
        name: val.name,
        formats: val.formats
      })
    })
    return info
  }

  _getSensorOptions(sensor) {
    let opts = {
      sensor: sensor.getCameraInfo(rs2.camera_info.camera_info_name),
      options: []
    }
    for (let opt in rs2.option) {
      if (typeof rs2.option[opt] === 'string') {
        if (sensor.supportsOption(rs2.option[opt])) {
          console.log(`getoption: ${opt}`)
          let obj = {
            option: rs2.option[opt],
            value: sensor.getOption(rs2.option[opt]),
            range: sensor.getOptionRange(rs2.option[opt])
          }
          opts.options.push(obj)
        }
      }
    }
    return opts
  }

  // find an array of streamProfiles that matches the input streamArray data.
  _findMatchingProfiles(sensor, streamArray) {
    var profiles = sensor.getStreamProfiles()
    var results = []

    console.log(streamArray)
    streamArray.forEach(s => {
      profiles.forEach(p => {
        if (p instanceof rs2.VideoStreamProfile) {
          if (
            rs2.stream.streamToString(p.streamValue) === s.stream &&
            rs2.format.formatToString(p.format) === s.format &&
            p.fps == s.fps &&
            `${p.width}*${p.height}` === s.resolution &&
            (s.index === undefined || p.streamIndex == s.index)
          ) {
            results.push(p)
          }
        }
      })
    })

    return results
  }

  _findSensorByName(sensorName) {
    for (let sensor of this.sensors) {
      if (sensor.getCameraInfo(rs2.camera_info.camera_info_name) === sensorName) {
        return sensor
      }
    }
  }

  async _processFrameBeforeSend(frame) {
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
          stream: rs2.stream.streamToString(streamType) + streamIndex,
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

  sendFrame(frameInfo) {
    const { meta, data } = frameInfo

    this.socket.send(JSON.stringify(meta))
    this.socket.send(data)
  }

  sendCommand(command) {
    this.socket.send(JSON.stringify(command))
  }
}
