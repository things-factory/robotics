const { ResponseTag } = require('./common')
const WebSocket = require('ws')
const express = require('express')
const path = require('path')

const port = 3000

export class ConnectionManager {
  public static connectionMgr: ConnectionManager

  app
  cmdSocket
  dataSockets
  dataSocketsReady
  wsPort
  port
  wss

  constructor(port, wsPort) {
    this.app = express()
    this.cmdSocket = null
    this.dataSockets = new Map()
    this.dataSocketsReady = new Map()
    this.wsPort = wsPort
    this.port = port
  }

  connectionCheck(req, res, next) {
    // if (ConnectionManager.connectMgr.cmdSocket) {
    //   res.send('A connection already exist!')
    // } else {
    next()
    // }
  }

  start() {
    this.app.all('*', this.connectionCheck)
    this.app.use(express.static(path.join(__dirname, 'public')))
    this.wss = new WebSocket.Server({ port: this.wsPort })

    this.wss.on('connection', socket => {
      if (!this.cmdSocket) {
        this.acceptCommandConnection(socket)
      } else {
        socket.addEventListener('message', event => {
          let streamObj = JSON.parse(event.data)
          this.dataSockets[streamObj.stream] = socket
          this.dataSocketsReady[streamObj.stream] = true
          console.log(`${streamObj.stream} connection established! ${this.dataSockets[streamObj.stream]}`)
        })
      }
    })
    this.app.listen(port)
    console.log(`listening on http://localhost:${this.port}`)
  }

  acceptCommandConnection(socket) {
    // console.log('Command connection established!')
    // this.cmdSocket = socket
    // this.cmdSocket.on('close', () => {
    //   rsObj.stop()
    //   rsObj.cleanup()
    //   this.cmdSocket = null
    // })
    // this.cmdSocket.on('message', msg => {
    //   rsObj.processCommand(JSON.parse(msg))
    // })
    // if (rsObj.isReady) {
    //   this.sendCmdObject(rsObj.getAllSensorInfo())
    //   this.sendCmdObject(rsObj.getPresets())
    //   this.sendCmdObject(rsObj.getOptions())
    //   this.sendCmdObject(rsObj.getDefaultConfig())
    // } else {
    //   this.sendCmdObject({ tag: ResponseTag.error, description: 'No camera found!' })
    // }
  }

  sendProcessedFrameData(data) {
    this.sendData(data.meta.stream, data.meta, true)
    this.sendData(data.meta.stream, data.data)
  }

  sendCmdObject(obj) {
    this.cmdSocket.send(JSON.stringify(obj))
  }

  sendData(streamName, data, isString = false) {
    if (!this.dataSocketsReady[streamName]) {
      console.error(`${streamName} data connection not established!`)
    }
    if (isString) {
      this.dataSockets[streamName].send(JSON.stringify(data))
    } else {
      this.dataSockets[streamName].send(data)
    }
  }
}
