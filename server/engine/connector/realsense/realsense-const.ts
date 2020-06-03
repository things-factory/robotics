export enum SENSOR {
  RGB = 'RGB Camera',
  STEREO = 'Stereo Module'
}

export enum STREAM {
  COLOR = 'color',
  INFRARED = 'infrared',
  DEPTH = 'depth'
}

export interface Profile {
  stream
  index?
  width?
  height?
  format?
  fps?
}

export const DEFAULT_CONFIG = {
  preset: 'custom',
  resolution: {
    [SENSOR.RGB]: '1280*720',
    [SENSOR.STEREO]: '1280*720'
  },
  fps: {
    [SENSOR.RGB]: 30,
    [SENSOR.STEREO]: 30
  },
  format: {
    [STREAM.DEPTH]: 'z16',
    [STREAM.INFRARED]: 'y8',
    [STREAM.COLOR]: 'rgb8'
  },
  streams: [STREAM.DEPTH, STREAM.COLOR, STREAM.INFRARED]
}
