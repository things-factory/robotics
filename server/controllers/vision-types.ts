// Base Interfaces
export interface Pose {
  x: number
  y: number
  z: number
  u: number
  v: number
  w: number
}

export interface Region {
  x1: number
  y1: number
  x2: number
  y2: number
}

export enum HANDEYE_TYPES {
  EYE_IN_HAND,
  EYE_TO_HAND
}

/**
 * 카메라 캘리브레이션의 결과 매트릭스
 */
export interface CameraMatrix {
  rows: number
  columns: number
  /**
   * 3 x 3 ?
   */
  data: number[]
}

export interface DistortionCoefficient {
  rows: number
  columns: number
  /**
   * ? x ?
   */
  data: number[]
}

/**
 * 핸드아이 캘리브레이션의 결과 매트릭스
 */
export interface HandEyeMatrix {
  rows: number
  columns: number
  /**
   * ? x ?
   */
  data: number[]
}

// Interfaces for Management Targets

/**
 * 카메라가 주시하는 작업 영역(또는 공간)
 */
export interface ROI {
  id: string | number
  region: Region
}

/**
 * 카메라의 추적 대상 오브젝트
 */
export interface TrackableObject {
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

  update(roi, pose)
}

/**
 * 마커 트래킹 기능 인터페이스
 */
export interface TrackingCamera {
  cameraMatrix: CameraMatrix
  handEyeMatrix: HandEyeMatrix
  /**
   * - 해당 카메라 캡쳐
   * - 캡쳐된 이미지내의 마커 Pose를 계산하여 storage를 업데이트
   * @param storage
   */
  // trace(storage: TrackingStorage): void
  capture(): any
}

// Interfaces for Management

export interface ROIProvider {
  findROIs(trackable: TrackingCamera): ROI[]
}

export interface ROIManager {
  provider: ROIProvider

  list(): ROI[]
  get(id): ROI
  register(ROI): void
}

export interface TrackingStorage {
  getObjectState(id: string | number)
  updateObjectState(id: string | number, roi?: ROI, pose?: Pose)
  publish(event: TrackingEvent)
}

export interface TrackingEngine {
  storage: TrackingStorage

  start()
  stop()
  evaluate()
}

// TrackableObject Event

export enum TRACKING_EVENT_TYPES {
  IN,
  STAY,
  OUT
}

export interface TrackingEvent {
  type: TRACKING_EVENT_TYPES
  object: TrackableObject
  from: {
    pose: Pose
    roi: ROI
    retention: number
  }
  to: {
    pose: Pose
    roi: ROI
    retention: number
  }
}
