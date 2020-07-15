import { Pose, TrackingEvent, TrackableObject, TrackingStorage, DEFAULT_POSE_THRESHOLD } from './robotics-types'
import { TrackableObjectImpl } from './trackable-object'

export class ROIStateStorageImpl implements TrackingStorage {
  states: { [id: string]: TrackableObject } = {}

  getObjectState(id) {
    return {
      ...this.states[id]
    }
  }

  getROIState(roi) {
    return Object.keys(this.states)
      .map(id => this.states[id])
      .filter(obj => obj.roi == roi)
      .sort((obj1, obj2) => (obj1.id > obj2.id ? 1 : -1))
      .map(obj => {
        return {
          ...obj
        }
      })
  }

  updateObjectState(id, roi, pose?: Pose, threshold?: Pose) {
    if (!this.states[id]) {
      this.states[id] = new TrackableObjectImpl(id)
    }
    var changes = this.states[id].update(
      roi,
      pose,
      threshold
        ? {
            ...DEFAULT_POSE_THRESHOLD,
            ...threshold
          }
        : DEFAULT_POSE_THRESHOLD
    )

    changes.forEach(change => this.publish(change))
  }

  publish(event: TrackingEvent) {
    console.log('\n\n\n\nevent', event)
  }
}
