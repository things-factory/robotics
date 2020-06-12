import { TrackingTarget, TrackingTargetEvent, Pose, TrackingTargetStorage } from '../vision-types'

export class ROIStateStorageImpl implements TrackingTargetStorage {
  states: { [id: string]: TrackingTarget } = {}

  getTargetState(roi) {
    return this.states[roi]
  }

  updateTargetState(roi, target?: TrackingTarget, pose?: Pose) {
    var changes = this.states[target.id].update(pose)

    changes.forEach(change => this.publish(change))
  }

  publish(change: { eventType: TrackingTargetEvent; roi: string; object?: string; pose?: Pose }) {}
}
