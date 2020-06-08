import { Connections } from '@things-factory/integration-base'

import Http from 'http'
import Dicer from 'dicer'
import SocketIO from 'socket.io'

const gst_multipart_boundary = '--videoboundary'

/*!
 * @class StdoutCamWrapper
 * @brief A wrapper that re-broadcasts GStreamer's webcam TCP packets in
 * Socket.IO events. This way browsers can fetch and understand webcam
 * video frames.
 * @credit http://stackoverflow.com/a/23605892/388751
 */
export class StdoutCamWrapper {
  /*!
   * @fn wrap
   * @brief wraps a TCP server previously started by GstLiveCamServer.
   */
  static wrap(gst_process, broadcast_tcp_addr, broadcast_tcp_port) {
    var broadcaster = Http.createServer().listen(broadcast_tcp_port, broadcast_tcp_addr)
    var io = SocketIO.listen(broadcaster)

    var dicer = new Dicer({ boundary: gst_multipart_boundary })

    dicer
      .on('part', function (part) {
        var frameEncoded = ''
        part.setEncoding('base64')

        part.on('data', function (data) {
          frameEncoded += data
        })
        part.on('end', function () {
          try {
            io.sockets.emit('image', frameEncoded)
          } catch (e) {
            Connections.logger.error(e)
          }
        })
        part.on('error', function (err) {
          Connections.logger.error('error', err)
        })
      })
      .on('error', function (err) {
        Connections.logger.error('error', err)
      })

    dicer.on('finish', function () {
      Connections.logger.info('Dicer finished: ' + broadcast_tcp_addr + ':' + broadcast_tcp_port)
    })

    gst_process.stdout.on('close', function () {
      broadcaster.close()
      Connections.logger.info('Socket closed: ' + broadcast_tcp_addr + ':' + broadcast_tcp_port)
    })

    gst_process.stdout.pipe(dicer)
  }
}
