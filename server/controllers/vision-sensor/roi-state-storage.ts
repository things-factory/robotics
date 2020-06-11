import { ROIEventType, Pose, ROIStateStorage } from './vision-sensor-types'
import { ROIState } from './roi-state'

export class ROIStateStorageImpl implements ROIStateStorage {
  states: { [roi: string]: ROIState } = {}

  getROIState(roi) {
    return this.states[roi]
  }

  updateROIState(roi, object?: string, pose?: Pose) {
    var changes = this.states[roi].update(object, pose)

    changes.forEach(change => this.publish(change))
  }

  publish(change: { eventType: ROIEventType; roi: string; object?: string; pose?: Pose }) {}
}
