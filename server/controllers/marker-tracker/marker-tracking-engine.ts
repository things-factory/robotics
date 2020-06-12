import { TrackingTargetStorage } from '../vision-types'

export class MarkerTrackingEngine {
  storage: TrackingTargetStorage

  cameras: any[]
  regions: any[]
  duration: number

  _interval: any

  constructor(storage: TrackingTargetStorage) {
    this.storage = storage
  }

  start() {
    var { cameras, regions } = this.fetchSensors()
    this.cameras = cameras
    this.regions = regions

    this._interval = setInterval(this.evaluate.bind(this), this.duration)
  }

  stop() {
    clearInterval(this._interval)
  }

  evaluate() {
    this.cameras.forEach(camera => camera.detect(this.storage))
  }

  fetchSensors() {
    return {
      cameras: [],
      regions: []
    }
  }
}
