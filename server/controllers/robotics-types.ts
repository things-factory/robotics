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
  lt: {
    x: number
    y: number
  }
  rb: {
    x: number
    y: number
  }
}

export enum HANDEYE_TYPES {
  EYE_IN_HAND,
  EYE_TO_HAND
}

export enum CAMERA_TYPES {
  STANDARD,
  REALSENSE
}

export enum ROBOTICS_OBJECT_TYPES {
  WORKSPACE = 'workspace',
  ROBOT_ARM = 'robot-arm',
  CAMERA = 'tracking-camera',
  ROI = 'ROI',
  OBJECT = 'trackable-object'
}

/**
 * 카메라 캘리브레이션의 결과 매트릭스
 */
export interface Matrix {
  rows: number
  columns: number
  /**
   * 3 x 3 ?
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
   * TrackableObject의 id, eg) tag id
   */
  id: string | number
  roi: ROI
  pose: Pose
  /**
   * ROI내 특정 위치에 체류한 시간
   */
  retention: number

  update(roi, pose, threshold)
}

/**
 * 트래킹 카메라의 베이스 스테이션
 * 현재 포즈 정보를 제공한다.
 */
export interface RobotArm {
  poiOffset: Pose
  pose: Pose
}

/**
 * 마커 트래킹 기능 인터페이스
 */
export interface TrackingCamera {
  cameraMatrix: Matrix
  handEyeMatrix: Matrix
  rois: ROI[]
  /**
   * - 해당 카메라 캡쳐
   * - 캡쳐된 이미지내의 마커 Pose를 계산하여 storage를 업데이트
   * @param storage
   */
  capture(): any
  configure(config: any): void
}

// Interfaces for Management

export interface TrackingStorage {
  getObjectState(id: string | number)
  updateObjectState(id: string | number, roi?: ROI, pose?: Pose)
  publish(event: TrackingEvent)
}

export interface TrackingEngine {
  trackingStorage: TrackingStorage

  start(options: any)
  stop()
  evaluate()
}

export const DEFAULT_POSE_THRESHOLD = { x: 0.002, y: 0.002, z: 0.002, u: 5, v: 5, w: 5 }

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
