import { Pose, TrackingEvent, TrackableObject, TrackingStorage } from './vision-types'
import { TrackableObjectImpl } from './trackable-object'

export class ROIStateStorageImpl implements TrackingStorage {
  states: { [id: string]: TrackableObject } = {}

  getObjectState(id) {
    return this.states[id]
  }

  updateObjectState(id, roi, pose?: Pose) {
    if (!this.states[id]) {
      this.states[id] = new TrackableObjectImpl(id)
    }
    var changes = this.states[id].update(roi, pose)

    changes.forEach(change => this.publish(change))
  }

  publish(event: TrackingEvent) {
    console.log('\n\n\n\nevent', event)
  }
}
