import { Pose, TrackingEvent, TrackableObject, TrackingStorage } from './vision-types'

export class ROIStateStorageImpl implements TrackingStorage {
  states: { [id: string]: TrackableObject } = {}

  getObjectState(id) {
    return this.states[id]
  }

  updateObjectState(id, roi, pose?: Pose) {
    var changes = this.states[id].update(roi, pose)

    changes.forEach(change => this.publish(change))
  }

  publish(event: TrackingEvent) {}
}
