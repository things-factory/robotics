import gql from 'graphql-tag'

export const VisionTypes = gql`
  type Pose {
    x: Float
    y: Float
    z: Float
    u: Float
    v: Float
    w: Float
  }

  type PixelPoint {
    x: Int
    y: Int
  }

  type Region {
    lt: PixelPoint
    rb: PixelPoint
  }

  type ROI {
    id: String
    region: Region
  }

  type Matrix {
    rows: Int
    columns: Int
    data: [Float]
  }
`
