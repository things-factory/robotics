import { TrackingTargetEvent, TrackingTarget, Pose, ROI } from './vision-types'

const isSamePose = (pose1, pose2) => {
  /* TODO 미세한 변화는 움직이지 않은 것으로 한다. */
  return true
}

export class TrackingTargetMarker implements TrackingTarget {
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

  update(region, pose) {
    var moving = true
    var movein = false
    var moveout = false

    if (this.region !== region) {
      movein = !!marker
      moveout == !!this.marker
    } else {
      moving = !isSamePose(this.pose, pose)
    }

    var events = []
    moveout &&
      events.push({
        eventType: TrackingTargetEvent.OUT,
        roi: this.roi,
        marker: this.marker
      })

    this.pose = pose
    this.retention = moving ? 0 : this.retention + 1

    movein &&
      events.push({
        eventType: TrackingTargetEvent.IN,
        roi: this.roi,
        trackingTarget: this,
        pose
      })

    this.retention == 1 &&
      events.push({
        eventType: TrackingTargetEvent.STAY,
        roi: this.roi,
        trackingTarget: this,
        pose
      })

    return events
  }

  get state() {
    return this.retention > 1
  }
}
