import rs2 from '@things-factory/node-librealsense2'

import Debug from 'debug'
const debug = Debug('things-factory:vision-base:realsense-camera-sensor')

export class RealsenseCameraSensor {
  device: string | number
  sensor: rs2.Sensor
  streamingProfiles = []
  streamingCallbacks = []

  private _info

  constructor(device: string | number, sensor: rs2.Sensor) {
    this.device = device
    this.sensor = sensor
  }

  dispose() {
    this.stop()
  }

  /**
   * 센서의 이름을 가져온다.
   */
  get name() {
    return this.sensor.getCameraInfo(rs2.camera_info.camera_info_name)
  }

  get started() {
    return this.streamingProfiles.length > 0
  }

  start(profile, streamCallback) {
    this.streamingCallbacks.push(streamCallback)

    /* 이미 스트리밍 중이면, callback에 추가만 한다. */
    if (!this.started) {
      this.streamingProfiles = this.info.streams.map(stream =>
        this.findProfile({
          ...profile,
          width: 1280,
          height: 720,
          stream: stream.stream,
          index: stream.index
        })
      )

      debug('open profiles:', this.streamingProfiles)
      this.sensor.open(this.streamingProfiles)
      this.sensor.start(async frame => {
        this.streamingCallbacks.forEach(callback =>
          callback(frame, {
            device: this.device,
            sensor: this
          })
        )
      })
    }
  }

  stop() {
    if (this.started) {
      this.sensor.stop()
      this.sensor.close()
      this.streamingProfiles = []
    }
  }

  /**
   * 센서의 이름과 가능한 프로파일리스트를 가져온다.
   */
  get info() {
    if (!this._info) {
      this._info = {
        name: this.sensor.getCameraInfo(rs2.camera_info.camera_info_name),
        resolutions: [],
        fpses: [],
        streams: [],
        profiles: this.sensor
          .getStreamProfiles()
          .filter(profile => profile instanceof rs2.VideoStreamProfile)
          .map(p => this.convertProfile(p))
          .sort((p1, p2) => p1.index - p2.index)
      }

      var { profiles, fpses, streams, resolutions } = this._info

      profiles.forEach(p => {
        !resolutions.find(e => e.w === p.width && e.h === p.height) && resolutions.push({ w: p.width, h: p.height })

        !fpses.find(fps => fps === p.fps) && fpses.push(p.fps)

        var { stream: streamName, format, index } = p

        var stream = streams.find(stream => stream.stream == streamName && stream.index == index)
        if (stream) {
          var formats = stream.formats
          !formats.find(f => format == f) && formats.push(format)
        } else {
          streams.push({
            index,
            stream: streamName,
            formats: [format]
          })
        }
      })
    }

    return this._info
  }

  /**
   * 센서의 현재 옵션과 설정 범위를 가져온다.
   */
  get options(): { option: String; value: Number; range: rs2.Range }[] {
    return Object.values(rs2.option)
      .filter(option => typeof option == 'string' && this.sensor.supportsOption(option))
      .map((option: String) => {
        return {
          option,
          value: this.sensor.getOption(option),
          range: this.sensor.getOptionRange(option)
        }
      })
  }

  /**
   * 센서의 옵션값을 가져온다.
   * @param option option
   */
  getOption(option: String): Number {
    return this.sensor.getOption(option)
  }

  /**
   * 센서의 옵션을 변경한다.
   * @param option option
   * @param value value
   */
  setOption(option: String, value: Number): void {
    this.sensor.setOption(option, Number(value))
  }

  /**
   * 일반 형식의 프로파일 배열에 해당하는 센서 프로파일들을 찾는다.
   * @param profiles 조회를 위한 일반 형식의 프로파일 배열
   */
  findProfiles(profiles): rs2.VideoStreamProfile[] {
    return profiles.map(p => this.findProfile(p)).filter(p => p)
  }

  /**
   * 일반 프로파일에 해당하는 센서의 rs2 프로파일을 찾는다.
   * stream을 필수 조건으로 하는 최소한의 정보로도 해당하는 rs2 프로파일을 찾는다.
   * @param profile rs2 형식의 프로파일을 찾는다.
   */
  findProfile(profile): rs2.VideoStreamProfile {
    return this.sensor
      .getStreamProfiles()
      .find(
        rp =>
          rp instanceof rs2.VideoStreamProfile &&
          rs2.stream.streamToString(rp.streamValue) === profile.stream &&
          (profile.format === undefined || rs2.format.formatToString(rp.format) === profile.format) &&
          (profile.fps === undefined || rp.fps == profile.fps) &&
          (profile.width === undefined || rp.width == profile.width) &&
          (profile.height === undefined || rp.height == profile.height) &&
          (profile.index === undefined || rp.streamIndex == profile.index)
      )
  }

  /**
   * rs2 형식의 프로파일을 일반 형식의 프로파일로 변환한다.
   * @param rs2Profile rs2 형식의 프로파일
   */
  convertProfile(rs2Profile) {
    var { width, height, fps, format, streamType, streamIndex: index } = rs2Profile

    return {
      width,
      height,
      fps,
      format: rs2.format.formatToString(format),
      stream: rs2.stream.streamToString(streamType),
      index
    }
  }
}
