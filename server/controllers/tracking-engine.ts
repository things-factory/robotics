import { TrackingEngine, TrackingStorage } from './vision-types'
import { ROIStateStorageImpl } from './tracking-storage'
import { config } from '@things-factory/env'
import { spawn } from 'child_process'
import kill from 'tree-kill'

const visionConfig = config.get('vision', {})
const program = visionConfig.objectTracker?.program

export class TrackingEngineImpl implements TrackingEngine {
  trackingStorage: TrackingStorage = new ROIStateStorageImpl()

  name: string
  trackables: any[]
  rois: any[]
  duration: number

  childProcess: any

  // _interval: any

  constructor(name) {
    this.name = name
  }

  start(options) {
    var { logger } = options
    var { trackables: trackables, rois: rois } = this.fetchSensors()
    this.trackables = trackables
    this.rois = rois

    var executable = program[0]
    var params = [...program.slice(1), this.name]

    this.childProcess = spawn(executable, params)
    this.childProcess.stdout.on('data', function (data) {
      logger.info('stdout: ' + data)
    })

    this.childProcess.stderr.on('data', function (data) {
      logger.error('stderr: ' + data)
    })

    this.childProcess.on('exit', function (code) {
      logger.info('exit: ' + code)
    })

    // this._interval = setInterval(this.evaluate.bind(this), this.duration)
  }

  stop() {
    this.childProcess && kill(this.childProcess.pid)

    // clearInterval(this._interval)
  }

  evaluate() {
    this.trackables.forEach(trackable => trackable.detect(this.trackingStorage))
  }

  fetchSensors() {
    return {
      trackables: [],
      rois: []
    }
  }
}
