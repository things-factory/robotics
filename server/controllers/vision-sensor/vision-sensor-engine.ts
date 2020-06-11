import { ROIStateStorage } from './vision-sensor-types'
import { ROIStateStorageImpl } from './roi-state-storage'

export class VisionSensorEngine {
  storage: ROIStateStorage

  cameras: any[]
  regions: any[]
  duration: number

  _interval: any

  start() {
    this.storage = new ROIStateStorageImpl()

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
