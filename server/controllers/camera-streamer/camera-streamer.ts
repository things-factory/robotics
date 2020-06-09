import WebSocket from 'ws'
import Channel from './channel'
import { CameraStreamDriver } from './camera-stream-driver'

import Debug from 'debug'
import { ClientRequest } from 'http'
const debug = Debug('things-factory:vision-base:camera-streamer')

const NOOP = function () {}

export class CameraStreamer {
  public static cameraDrivers: { [key: string]: CameraStreamDriver } = {}

  public wss: WebSocket.Server
  public streams: { [key: string]: WebSocket[] } = {}
  private channelParser: (request) => { type; device; stream; channel } = Channel.DEFAULT_CHANNEL_PARSER
  private closedCallback: (socket, request) => void = NOOP
  private connectedCallback: (socket, request) => void = NOOP

  public static registerCameraDriver(type, handler): void {
    CameraStreamer.cameraDrivers[type] = handler
  }

  public static getCameraDriver(type): CameraStreamDriver {
    return CameraStreamer.cameraDrivers[type]
  }

  despose(): void {
    if (this.wss) {
      this.wss.close()
      delete this.wss
    }
  }

  constructor(options, callbackOptions?) {
    var { connectedCallback = NOOP, closedCallback = NOOP, channelParser = Channel.DEFAULT_CHANNEL_PARSER } =
      callbackOptions || {}

    this.wss = new WebSocket.Server(options)
    this.channelParser = channelParser
    this.connectedCallback = connectedCallback
    this.closedCallback = closedCallback

    this.wss.on('connection', this.onconnection.bind(this))
  }

  onconnection(socket, request): void {
    var { remoteAddress, remotePort } = request.socket

    debug('on-connection', request.url, remoteAddress, remotePort)

    socket.on('close', () => {
      debug('on-close', type, request.url, remoteAddress, remotePort)

      var driver = this.getDriver(type)
      driver.unsubscribe(subscription)

      this.closedCallback(socket, request)
    })

    socket.on('error', err => {
      debug('on-error', request.url, remoteAddress, remotePort, err)
    })

    var { type, device, stream, index } = this.getChannel(request)

    var subscription = this.getDriver(type)?.subscribe(type, device, { stream, index }, socket)

    this.connectedCallback(socket, request)
  }

  publish(message, channel): void {
    var { type } = Channel.fromChannel(channel)
    this.getDriver(type)?.publish(message, channel)
  }

  getChannel(request): { type; device; stream; index; channel } {
    return Channel.fromParser(this.channelParser, request)
  }

  getDriver(type): CameraStreamDriver {
    return CameraStreamer.getCameraDriver(type)
  }

  async handleRequest(request) {
    var { type } = request

    debug('request', request)
    return await this.getDriver(type)?.handleRequest(request)
  }
}
