import gql from 'graphql-tag'

export const TrackingWorkspace = gql`
  type TrackingWorkspace {
    id: String
    name: String
    domain: Domain
    description: String
    type: String
    endpoint: String
    active: Boolean
    params: Object
    robotArms: [RobotArm]
    trackingCameras: [TrackingCamera]
    trackableObjects: [TrackableObject]
    updater: User
    creator: User
    updatedAt: String
    createdAt: String
  }
`
