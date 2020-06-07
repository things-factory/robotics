import { Connections, Connector } from '@things-factory/integration-base'
import { LiveCamUI } from '../../controllers/camera-streamer/gstreamer/livecam-ui'
import { GstLaunch } from '../../controllers/camera-streamer/gstreamer/gst-launcher'
import { GstLiveCamServer } from '../../controllers/camera-streamer/gstreamer/gst-livecam-server'
import { StdoutCamWrapper } from '../../controllers/camera-streamer/gstreamer/stdout-cam-wrapper'

export class GStreamerServer implements Connector {
  async ready(connectionConfigs) {
    await Promise.all(connectionConfigs.map(this.connect))

    Connections.logger.info('gstreamer-servers are ready')
  }

  async connect(connection) {
    var [host = '0.0.0.0', wsPort = 12000] = connection.endpoint.split(':')
    var {
      // sample UI service port
      uiPort = 11000,
      // should frames be converted to grayscale (default : false)
      grayscale = false,
      // should width of the frame be resized (default : 0)
      // provide 0 to match webcam input
      width = 800,
      // should height of the frame be resized (default : 0)
      // provide 0 to match webcam input
      height = 600,
      // should a fake source be used instead of an actual webcam
      // suitable for debugging and development (default : false)
      fake = false,
      // framerate of the feed (default : 0)
      // provide 0 to match webcam input
      framerate = 25
    } = connection.params

    if (!GstLaunch.isAvailable()) {
      Connections.logger.error('Unable to locate gst-launch executable.')
      Connections.logger.error('You are most likely missing the GStreamer runtime.')

      throw new Error('Unable to broadcast.')
    }

    var broadcast = function () {
      // address and port of the webcam UI
      const ui_addr = host
      const ui_port = uiPort
      // address and port of the webcam Socket.IO server
      // this server broadcasts GStreamer's video frames
      // for consumption in browser side.
      const broadcast_addr = host
      const broadcast_port = wsPort
      const webcam = {
        grayscale,
        width,
        height,
        fake,
        framerate
      }

      var gst_cam_ui = new LiveCamUI()
      var gst_cam_server = new GstLiveCamServer(webcam)
      var gst_cam_process = gst_cam_server.start()
      var gst_cam_wrap

      var started = false
      gst_cam_process.stdout.on('data', function (data) {
        // This catches GStreamer when pipeline goes into PLAYING state

        // 프로세스 출력 메시지와 실제 비디오 데이타를 구분해서 처리할 필요가 있다. started되면, listen을 멈추는 방법이 좋을 듯.
        if (!started && data.toString().includes('Setting pipeline to PLAYING') > 0) {
          gst_cam_wrap = StdoutCamWrapper.wrap(gst_cam_process, broadcast_addr, broadcast_port)
          gst_cam_ui.serve(ui_addr, ui_port, broadcast_addr, broadcast_port)

          Connections.logger.info(`gstreamer-server connection(${connection.name}:${connection.endpoint}) is started`)

          started = true
        }
      })

      gst_cam_process.stderr.on('data', function (data) {
        Connections.logger.info(data.toString())
      })
      gst_cam_process.on('error', function (err) {
        Connections.logger.info('Webcam server error: ' + err)
      })
      gst_cam_process.on('exit', function (code) {
        Connections.logger.info('Webcam server exited: ' + code)
      })

      return {
        gst_cam_ui,
        gst_cam_wrap,
        gst_cam_server
      }
    }

    var server = broadcast()

    Connections.addConnection(connection.name, server)
  }

  async disconnect(name) {
    const { gst_cam_ui, gst_cam_wrap, gst_cam_server } = Connections.removeConnection(name)

    gst_cam_wrap?.destroy()
    gst_cam_server?.stop()
    gst_cam_ui?.close()

    Connections.logger.info(`gstreamer-server connection(${name}) is stoped`)
  }

  get parameterSpec() {
    return [
      {
        type: 'checkbox',
        label: 'grayscale',
        name: 'grayscale'
      },
      {
        type: 'checkbox',
        label: 'fake',
        name: 'fake'
      },
      {
        type: 'number',
        label: 'width',
        name: 'width'
      },
      {
        type: 'number',
        label: 'height',
        name: 'height'
      },
      {
        type: 'number',
        label: 'framerate',
        name: 'framerate'
      },
      {
        type: 'number',
        label: 'ui-port',
        name: 'uiPort'
      }
    ]
  }
}

Connections.registerConnector('gstreamer-server', new GStreamerServer())
