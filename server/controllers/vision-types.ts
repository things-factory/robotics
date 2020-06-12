export interface Pose {
  x: number
  y: number
  z: number
  u: number
  v: number
  w: number
}

export enum HANDEYE_TYPES {
  EYE_IN_HAND,
  EYE_TO_HAND
}

export interface CameraMatrix {}

export interface HandEyeMatrix {}

export interface RegionArea {
  x1: number
  y1: number
  x2: number
  y2: number
}

/**
 * 마커 트래킹 영역
 */
export interface ROI {
  id: string | number
  area: RegionArea
}

export enum TrackingTargetEvent {
  IN,
  STAY,
  OUT
}

export interface TrackingTarget {
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

  update(pose)
}

export interface TrackingTargetStorage {
  getTargetState(target)
  updateTargetState(roi, target?: TrackingTarget, pose?: Pose)
  publish(change: { eventType: TrackingTargetEvent; target?: TrackingTarget; pose?: Pose })
}

/**
 * 마커 트래킹 기능 인터페이스
 */
export interface TrackingTargetTracker {
  cameraMatrix: CameraMatrix
  handEyeMatrix: HandEyeMatrix
  /**
   * - 해당 카메라 캡쳐
   * - 캡쳐된 이미지내의 마커 Pose를 계산하여 storage를 업데이트
   * @param storage
   */
  trace(storage: TrackingTargetStorage): void
}
