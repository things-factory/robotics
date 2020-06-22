import gql from 'graphql-tag'

export const VisionWorkspace = gql`
  type VisionWorkspace {
    id: String
    name: String
    domain: Domain
    description: String
    type: String
    endpoint: String
    active: Boolean
    params: Object
    RobotArms: [RobotArm]
    TrackingCameras: [TrackingCamera]
    TrackableObject: [TrackableObject]
    updater: User
    creator: User
    updatedAt: String
    createdAt: String
  }
`
