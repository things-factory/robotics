import { Connections } from '@things-factory/integration-base'
import { GstLaunch } from './gst-launcher'
import OS from 'os'
import kill from 'tree-kill'

/*!
 * @class GstLiveCamServer
 * @brief Encapsulates a GStreamer pipeline to broadcast default webcam.
 */
export class GstLiveCamServer {
  gst_video_src: String
  gst_multipart_boundary: String = '--videoboundary'

  public childProcess: any

  constructor(config) {
    var { fake = false, width = 0, height = 0, framerate = 0, grayscale = false } = config || {}
    var gst_video_src = ''

    if (!fake) {
      if (OS.platform() == 'win32') gst_video_src = 'ksvideosrc ! decodebin'
      else if (OS.platform() == 'linux') gst_video_src = 'v4l2src ! decodebin'
      else if (OS.platform() == 'darwin') gst_video_src = 'avfvideosrc device-index=0'
      else gst_video_src = 'videotestsrc'
    } else {
      gst_video_src = 'videotestsrc'
    }

    if (width > 0 || height > 0) {
      gst_video_src += ' ! videoscale ! video/x-raw,width=' + parseInt(width) + ',height=' + parseInt(height)
    }

    if (framerate > 0) {
      gst_video_src += ' ! videorate ! video/x-raw,framerate=' + parseInt(framerate) + '/1'
    }

    if (grayscale) {
      gst_video_src += ' ! videobalance saturation=0.0 ! videoconvert'
    }

    this.gst_video_src = gst_video_src
  }

  /*!
   * @fn start
   * @brief Starts a GStreamer pipeline that broadcasts the default
   * webcam over the given TCP address and port.
   * @return A Node <child-process> of the launched pipeline
   */
  start(tcp_addr, tcp_port) {
    const cam_pipeline =
      this.gst_video_src +
      ' ! jpegenc ! multipartmux  boundary="' +
      this.gst_multipart_boundary +
      '" ! tcpserversink host=' +
      tcp_addr +
      ' port=' +
      tcp_port

    if (GstLaunch.isAvailable()) {
      Connections.logger.info('GstLaunch found: ' + GstLaunch.getPath())
      Connections.logger.info('GStreamer version: ' + GstLaunch.getVersion())
      Connections.logger.info('GStreamer pipeline: ' + cam_pipeline)

      this.childProcess = GstLaunch.spawnPipeline(cam_pipeline)
      return this.childProcess
    } else {
      throw new Error('GstLaunch not found.')
    }
  }

  stop() {
    this.childProcess && kill(this.childProcess.pid)
  }
}
