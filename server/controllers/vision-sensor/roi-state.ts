import { ROIEventType, Pose } from './vision-sensor-types'

const isSamePose = (pose1, pose2) => {
  /* TODO 미세한 변화는 움직이지 않은 것으로 한다. */
  return true
}

export class ROIState {
  roi: string
  object: string
  stay: number
  pose: Pose

  constructor(roi, object, stay, pose) {
    this.roi = roi
    this.object = object
    this.stay = stay
    this.pose = pose
  }

  update(object, pose) {
    var moving = true
    var movein = false
    var moveout = false

    if (this.object !== object) {
      movein = !!object
      moveout == !!this.object
    } else {
      moving = !isSamePose(this.pose, pose)
    }

    var events = []
    moveout &&
      events.push({
        eventType: ROIEventType.OUT,
        roi: this.roi,
        object: this.object
      })

    this.object = object
    this.pose = pose
    this.stay = moving ? 0 : this.stay + 1

    movein &&
      events.push({
        eventType: ROIEventType.IN,
        roi: this.roi,
        object,
        pose
      })

    this.stay == 1 &&
      events.push({
        eventType: ROIEventType.STAY,
        roi: this.roi,
        object,
        pose
      })

    return events
  }

  get state() {
    return this.stay > 1
  }
}
