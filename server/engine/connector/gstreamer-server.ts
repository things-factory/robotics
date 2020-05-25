import { Connections, Connector } from '@things-factory/integration-base'
import { LiveCamUI } from './gstreamer/livecam-ui'
import { GstLaunch } from './gstreamer/gst-launcher'
import { GstLiveCamServer } from './gstreamer/gst-livecam-server'
import { SocketCamWrapper } from './gstreamer/socket-cam-wrapper'

export class GStreamerServer implements Connector {
  async ready(connectionConfigs) {
    await Promise.all(connectionConfigs.map(this.connect))

    Connections.logger.info('gstreamer-servers are ready')
  }

  async connect(connection) {
    var [host = '0.0.0.0', wsPort = 12000] = connection.endpoint.split(':')
    var {
      // gstreamer service port
      gstreamerPort = 10000,
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
      // address and port of GStreamer's tcp sink
      const gst_tcp_addr = host
      const gst_tcp_port = gstreamerPort
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
      var gst_cam_process = gst_cam_server.start(gst_tcp_addr, gst_tcp_port)
      var gst_cam_wrap

      gst_cam_process.stdout.on('data', function (data) {
        Connections.logger.info(data.toString())
        // This catches GStreamer when pipeline goes into PLAYING state
        if (data.toString().includes('Setting pipeline to PLAYING') > 0) {
          gst_cam_wrap = SocketCamWrapper.wrap(gst_tcp_addr, gst_tcp_port, broadcast_addr, broadcast_port)
          gst_cam_ui.serve(ui_addr, ui_port, broadcast_addr, broadcast_port)
          // gst_cam_ui.close()

          Connections.logger.info(`gstreamer-server connection(${connection.name}:${connection.endpoint}) is started`)
        }
      })

      gst_cam_process.stderr.on('data', function (data) {
        Connections.logger.info(data.toString())
        // gst_cam_ui.close()
      })
      gst_cam_process.on('error', function (err) {
        Connections.logger.info('Webcam server error: ' + err)
        // gst_cam_ui.close()
      })
      gst_cam_process.on('exit', function (code) {
        Connections.logger.info('Webcam server exited: ' + code)
        // gst_cam_ui.close()
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
      },
      {
        type: 'number',
        label: 'gstreamer-port',
        name: 'gstreamerPort'
      }
    ]
  }
}

Connections.registerConnector('gstreamer-server', new GStreamerServer())
