import { RealsenseClient } from './realsense-client'

import { RealsenseInfraredStream } from './realsense-infrared-stream'
import { RealsenseColorStream } from './realsense-color-stream'
import { RealsenseDepthStream } from './realsense-depth-stream'

export class RealsenseClient {
  cameraStream
  infraredStream1
  infraredStream2
  colorStream
  depthStream

  constructor(canvas1, canvas2, canvas3, canvas4) {
    this.infraredStream1 = new RealsenseInfraredStream(canvas1)
    this.infraredStream2 = new RealsenseInfraredStream(canvas2)
    this.colorStream = new RealsenseColorStream(canvas3)
    this.depthStream = new RealsenseDepthStream(canvas4)

    this.cameraStream = new RealsenseClient(0, data => {
      /* how to tell target - infraredStream1, 2, color, depth */

      /* data should be a Blob or String */
      if (typeof e.data === 'string') {
        this.infraredStream1.configure(JSON.parse(data))
      } else if (data instanceof Blob) {
        this.infraredStream1.stream(data)
      } else {
        // data instanceof ArrayBuffer
        // ASSERT(false)
      }
    })

    this.cameraStream.connect()
  }
}
