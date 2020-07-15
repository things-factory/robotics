import { TrackingEngine, TrackingStorage } from './robotics-types'
import { ROIStateStorageImpl } from './tracking-storage'
import { config } from '@things-factory/env'
import { spawn } from 'child_process'
import kill from 'tree-kill'

const visionConfig = config.get('vision', {})
const program = visionConfig.objectTracker?.program
const NOOP = () => {}

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
    var { onstdout, onstderr, onexit } = options
    var { trackables: trackables, rois: rois } = this.fetchSensors()
    this.trackables = trackables
    this.rois = rois

    var executable = program[0]
    var params = [...program.slice(1), this.name]

    this.childProcess = spawn(executable, params)
    this.childProcess.stdout.on('data', onstdout || NOOP)
    this.childProcess.stderr.on('data', onstderr || NOOP)
    this.childProcess.on('exit', onexit || NOOP)

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
