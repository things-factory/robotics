import { EventType, Pose } from './types'

const isSamePose = (pose1, pose2) => {
  /* TODO 미세한 변화는 움직이지 않은 것으로 한다. */
  return true
}

export class VisionSensor {
  tag: string
  object: string
  stay: number
  pose: Pose

  constructor(tag, object, stay, pose) {
    this.tag = tag
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
        eventType: EventType.OUT,
        tag: this.tag,
        object: this.object
      })

    this.object = object
    this.pose = pose
    this.stay = moving ? 0 : this.stay + 1

    movein &&
      events.push({
        eventType: EventType.IN,
        tag: this.tag,
        object,
        pose
      })

    this.stay == 1 &&
      events.push({
        eventType: EventType.STAY,
        tag: this.tag,
        object,
        pose
      })

    return events
  }

  get state() {
    return this.stay > 1
  }
}
