export enum ROIEventType {
  IN,
  STAY,
  OUT
}

export interface Pose {
  x: number
  y: number
  z: number
  u: number
  v: number
  w: number
}

export interface ROIStateStorage {
  getROIState(roi)
  updateROIState(roi, object?: string, pose?: Pose)
  publish(change: { eventType: ROIEventType; roi: string; object?: string; pose?: Pose })
}

export interface VisionSensor {
  detectRegion(storage: ROIStateStorage): void
}
