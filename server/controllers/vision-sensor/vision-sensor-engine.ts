import { VisionSensorStorage } from './vision-sensor-storage'

export class VisionSensorEngine {
  storage: VisionSensorStorage

  cameras: any[]
  regions: any[]
  duration: Number

  start() {
    this.storage = new VisionSensorStorage()

    var { cameras, regions } = this.fetchSensors()
    this.cameras = cameras
    this.regions = regions
  }

  stop() {}

  fetchSensors() {
    return {
      cameras: [],
      regions: []
    }
  }
}
