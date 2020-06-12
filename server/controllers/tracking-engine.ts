import { TrackingEngine, TrackingStorage } from './vision-types'

export class TrackingEngineImpl implements TrackingEngine {
  storage: TrackingStorage

  trackables: any[]
  rois: any[]
  duration: number

  _interval: any

  start() {
    var { trackables: trackables, rois: rois } = this.fetchSensors()
    this.trackables = trackables
    this.rois = rois

    this._interval = setInterval(this.evaluate.bind(this), this.duration)
  }

  stop() {
    clearInterval(this._interval)
  }

  evaluate() {
    this.trackables.forEach(trackable => trackable.detect(this.storage))
  }

  fetchSensors() {
    return {
      trackables: [],
      rois: []
    }
  }
}
