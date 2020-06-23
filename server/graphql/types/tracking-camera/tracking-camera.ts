import gql from 'graphql-tag'

export const TrackingCamera = gql`
  type TrackingCamera {
    id: String
    name: String
    domain: Domain
    description: String
    type: String
    endpoint: String
    active: Boolean
    config: Object
    baseRobotArm: RobotArm
    cameraMatrix: Matrix
    distortionCoefficient: [Float]
    handEyeMatrix: Matrix
    rois: [ROI]
    updater: User
    creator: User
    updatedAt: String
    createdAt: String
  }
`
