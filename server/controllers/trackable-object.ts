import { TrackingEvent, TrackableObject, Pose, ROI, TRACKING_EVENT_TYPES } from './robotics-types'
import { logger } from '@things-factory/env'

const EMPTY_POSE = {
  x: NaN,
  y: NaN,
  z: NaN,
  u: NaN,
  v: NaN,
  w: NaN
}

const isSamePose = (pose1, pose2, threshold) => {
  if ((!pose1 || pose1 === EMPTY_POSE) && (!pose2 || pose2 === EMPTY_POSE)) {
    return true
  }

  if (!pose1 || pose1 === EMPTY_POSE || !pose2 || pose2 === EMPTY_POSE) {
    return false
  }

  /* TODO 미세한 변화는 움직이지 않은 것으로 한다. */
  var { x: x1, y: y1, z: z1, u: u1, v: v1, w: w1 } = pose1
  var { x: x2, y: y2, z: z2, u: u2, v: v2, w: w2 } = pose2
  var { x: tx, y: ty, z: tz, u: tu, v: tv, w: tw } = threshold

  return (
    Math.abs(x1 - x2) < Number(tx) &&
    Math.abs(y1 - y2) < Number(ty) &&
    Math.abs(z1 - z2) < Number(tz) &&
    Math.abs(u1 - u2) < Number(tu) &&
    Math.abs(v1 - v2) < Number(tv) &&
    Math.abs(w1 - w2) < Number(tw)
  )
}

const isValidPose = pose => {
  if (!pose) {
    return false
  }

  var { x, y, z, u, v, w } = pose
  return ([x, y, z, u, v, w].findIndex(x => isNaN(x) || x === null || x === '') === -1)
}

export enum TrackableObjectState {
  UNDETERMIN = -1,
  MOVING = 0,
  STABLE = 1
}

export class TrackableObjectImpl implements TrackableObject {
  /**
   * TrackableObject의 id, eg) tag id
   */
  id: string | number
  roi: ROI
  pose: Pose
  updatedAt: number
  movedAt: number

  /**
   * ROI내 특정 위치에 체류한 시간
   */
  retention: number
  unknownRetention: number = 0
  //   state: TrackableObjectState = TrackableObjectState.UNDETERMIN

  constructor(id) {
    this.id = id
  }

  update(roi, pose, threshold) {
    if (!isValidPose(pose)) {
      this.unknownRetention++
      return null
      //   pose = EMPTY_POSE
    }

    if (!roi) {
      roi = ''
    }

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
      moveout = !!this.roi
    } else {
      moving = !isSamePose(this.pose, pose, threshold)
    }

    var events: TrackingEvent[] = []
    moveout &&
      events.push({
        type: TRACKING_EVENT_TYPES.OUT,
        object: this,
        from,
        to
      })

    this.roi = roi || ''
    this.pose = pose || EMPTY_POSE
    this.retention = moving ? 0 : this.retention + this.unknownRetention + 1
    this.unknownRetention = 0
    this.updatedAt = Date.now()
    if (moving) {
      this.movedAt = this.updatedAt
    }

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

  get state(): TrackableObjectState {
    return this.unknownRetention > 0
      ? TrackableObjectState.UNDETERMIN
      : this.retention > 1
      ? TrackableObjectState.STABLE
      : TrackableObjectState.MOVING
  }
}
