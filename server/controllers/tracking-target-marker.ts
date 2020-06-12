import { TrackingEvent, TrackableObject, Pose, ROI, TRACKING_EVENT_TYPES } from './vision-types'

const isSamePose = (pose1, pose2) => {
  /* TODO 미세한 변화는 움직이지 않은 것으로 한다. */
  return true
}

export class TrackingTargetMarker implements TrackableObject {
  /**
   * TrackingTarget의 id, eg) marker id
   */
  id: string | number
  description: string
  type: string
  /**
   * tracking 된 중심점으로부터의 실제 position offset 정보
   */
  pivotOffset: Pose
  roi: ROI
  /**
   * ROI내 특정 위치에 체류한 시간
   */
  retention: number
  pose: Pose

  marker: string

  constructor(roi, marker, retention, pose) {
    this.roi = roi
    this.marker = marker
    this.retention = retention
    this.pose = pose
  }

  update(roi, pose) {
    var from = {
      roi: this.roi,
      pose: this.pose,
      retention: this.retention
    }
    var to = {
      roi: roi,
      pose: pose,
      retention: 0
    }

    var moving = true
    var movein = false
    var moveout = false

    if (this.roi !== roi) {
      /* roi가 바뀌었다면 movein/out 중이다 */
      movein = !!roi
      moveout == !!this.roi
    } else {
      moving = !isSamePose(this.pose, pose)
    }

    var events: TrackingEvent[] = []
    moveout &&
      events.push({
        type: TRACKING_EVENT_TYPES.OUT,
        object: this,
        from,
        to
      })

    this.pose = pose
    this.retention = moving ? 0 : this.retention + 1

    movein &&
      events.push({
        type: TRACKING_EVENT_TYPES.IN,
        object: this,
        from,
        to
      })

    this.retention == 1 &&
      events.push({
        type: TRACKING_EVENT_TYPES.STAY,
        object: this,
        from,
        to: {
          ...to,
          retention: 1
        }
      })

    return events
  }

  get state() {
    return this.retention > 1
  }
}
