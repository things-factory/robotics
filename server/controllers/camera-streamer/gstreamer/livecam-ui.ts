import { Connections } from '@things-factory/integration-base'
import Http from 'http'

const template = function () {
  /*
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>livecam UI</title>
    <script type="text/javascript" src="https://cdn.socket.io/socket.io-1.4.5.js"></script>
    <script type="text/javascript" src="https://code.jquery.com/jquery-1.12.4.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/meyer-reset/2.0/reset.min.css">
    <style type="text/css">html,body,.feed,.feed img{width:100%;height:100%;overflow:hidden;}</style>
  </head>
  <body>
    <div class="feed"><img id="video" src="" /></div>
    <script>
      var webcam_addr = location.hostname;
      var webcam_port = "@WEBCAM_PORT@";
      var webcam_host = $(".feed img");
      var socket = io.connect('http://' + webcam_addr + ':' + webcam_port);
      
      socket.on('image', function (data) {
        webcam_host.attr("src", "data:image/jpeg;base64," + data );
      });
    </script>
  </body>
</html>
*/
}
  .toString()
  .match(/\/\*\s*([\s\S]*?)\s*\*\//m)[1]

/*!
 * @class LiveCamUI
 * @brief serves a minimal UI to view the webcam broadcast.
 */
export class LiveCamUI {
  public server

  serve(ui_addr, ui_port, webcam_addr, webcam_port) {
    this.close()
    this.server = Http.createServer(function (request, response) {
      response.writeHead(200, { 'Content-Type': 'text/html' })
      response.write(template.replace('@WEBCAM_ADDR@', webcam_addr).replace('@WEBCAM_PORT@', webcam_port))
      response.end()
    })

    this.server.listen(ui_port, ui_addr)

    Connections.logger.info('Open http://' + ui_addr + ':' + ui_port + '/ in your browser!')
  }

  close() {
    if (this.server) {
      this.server.close()
      this.server = undefined
    }
  }
}
