import { EventType, Pose } from './types'
import { VisionSensor } from './vision-sensor'

export class VisionSensorStorage {
  sensors: { [tag: string]: VisionSensor } = {}

  getSensor(tag) {
    return this.sensors[tag]
  }

  updateSensor(tag, object?: string, pose?: Pose) {
    var changes = this.sensors[tag].update(object, pose)

    changes.forEach(change => this.publish(change))
  }

  publish(change: { eventType: EventType; tag: string; object?: string; pose?: Pose }) {}
}
