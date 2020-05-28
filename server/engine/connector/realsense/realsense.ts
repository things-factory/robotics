import rs2 from '@things-factory/node-librealsense2'

const { ResponseTag, CommandTag, CommonNames } = require('./common')
const sharp = require('sharp')

const jpegQuality = 40

export class Realsense {
  wrapper
  connectMgr
  sendCount
  ctx
  colorizer
  decimate
  sensors

  constructor(connectMgr) {
    this.connectMgr = connectMgr
    this.sendCount = {}

    for (let name of [
      CommonNames.colorStreamName,
      CommonNames.stereoStreamName,
      CommonNames.infraredStream1Name,
      CommonNames.infraredStream2Name
    ]) {
      this.sendCount[name] = 0
    }
  }

  init() {
    this.ctx = new rs2.Context()
    this.colorizer = new rs2.Colorizer()
    this.decimate = new rs2.DecimationFilter()
    this.sensors = this.ctx.querySensors()
  }

  stop() {}

  get isReady() {
    return this.sensors
  }

  cleanup() {
    this.ctx = null
    this.sensors = null
    rs2.cleanup()
  }

  // return the presets response
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

  // return the sensorInfo response
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

  // return the options response
  getOptions() {
    if (!this.sensors) {
      return undefined
    }
    let options = {
      tag: ResponseTag.options,
      data: {}
    }
    this.sensors.forEach(s => {
      let sensorName = s.getCameraInfo(rs2.camera_info.camera_info_name)
      options.data[sensorName] = this._getSensorOptions(s)
    })
    return options
  }

  // return the defaultCfg response
  getDefaultConfig() {
    let cfg = {
      tag: ResponseTag.defaultCfg,
      data: {
        preset: 'custom',
        resolution: [
          [CommonNames.stereoSensorName, '1280*720'],
          [CommonNames.colorSensorName, '1280*720']
        ],
        fps: [
          [CommonNames.stereoSensorName, 30],
          [CommonNames.colorSensorName, 30]
        ],
        format: [
          [CommonNames.stereoStreamName, 'z16'],
          [CommonNames.infraredStream1Name, 'y8'],
          [CommonNames.infraredStream2Name, 'y8'],
          [CommonNames.colorStreamName, 'rgb8']
        ],
        streams: [CommonNames.stereoStreamName, CommonNames.colorStreamName, CommonNames.infraredStream1Name]
      }
    }
    return cfg
  }

  // process commands from browser
  processCommand(cmd) {
    switch (cmd.tag) {
      case CommandTag.start:
        console.log('start command')
        console.log(cmd)
        this._handleStart(cmd)
        break
      case CommandTag.setOption:
        console.log('Set option command')
        console.log(cmd)
        this._handleSetOption(cmd)
        break
      default:
        console.log(`Unrecognized command ${cmd}`)
        break
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
  _findMatchingProfiles(sensorName, streamArray) {
    let sensor = this._findSensorByName(sensorName)
    let profiles = sensor.getStreamProfiles()
    let results = []

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
    return undefined
  }

  _processFrameBeforeSend(sensor, frame) {
    const streamType = frame.streamType
    const width = frame.width
    const height = frame.height
    const streamIndex = frame.profile.streamIndex
    const format = frame.format

    return new Promise((resolve, reject) => {
      if (streamType === rs2.stream.STREAM_COLOR) {
        sharp(Buffer.from(frame.data.buffer), {
          raw: {
            width: width,
            height: height,
            channels: 3
          }
        })
          .jpeg({
            quality: jpegQuality
          })
          .toBuffer()
          .then(data => {
            let result = {
              meta: {
                stream: rs2.stream.streamToString(streamType),
                index: frame.profile.streamIndex,
                format: rs2.format.formatToString(format),
                width: width,
                height: height
              },
              data: data
            }
            resolve(result)
          })
      } else if (streamType === rs2.stream.STREAM_DEPTH) {
        const depthMap = this.colorizer.colorize(frame)
        sharp(Buffer.from(depthMap.data.buffer), {
          raw: {
            width: width,
            height: height,
            channels: 3
          }
        })
          .jpeg({
            quality: jpegQuality
          })
          .toBuffer()
          .then(data => {
            let result = {
              meta: {
                stream: rs2.stream.streamToString(streamType),
                index: frame.profile.streamIndex,
                format: rs2.format.formatToString(format),
                width: width,
                height: height
              },
              data: data
            }
            resolve(result)
          })
      } else if (streamType === rs2.stream.STREAM_INFRARED) {
        const infraredFrame = this.decimate.process(frame)
        // const infraredFrame = frame;
        let result = {
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
        resolve(result)
      }
    })
  }

  // process the start command
  _handleStart(cmd) {
    let profiles = this._findMatchingProfiles(cmd.data.sensor, cmd.data.streams)
    let sensor = this._findSensorByName(cmd.data.sensor)
    if (profiles && sensor) {
      console.log('open profiles:')
      console.log(profiles)
      sensor.open(profiles)
      sensor.start(frame => {
        this._processFrameBeforeSend(sensor, frame).then(output => {
          // connectMgr.sendProcessedFrameData(output)
          // this.sendCount[output.meta.stream]++
        })
      })
    }
  }

  // process set option command
  _handleSetOption(cmd) {
    let sensor = this._findSensorByName(cmd.data.sensor)
    sensor.setOption(cmd.data.option, Number(cmd.data.value))
  }
}
