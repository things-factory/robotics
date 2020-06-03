import { expect } from 'chai'
import rs2 from '@things-factory/node-librealsense2'
import { Realsense, SENSOR } from '../../server/engine/connector/realsense'

describe('Realsense', function () {
  before(function () {
    Realsense.init()
  })

  after(function () {
    Realsense.cleanup()
  })

  describe('start-stop', function () {
    this.timeout(20000)

    it('should have color frame', done => {
      var subscription = Realsense.subscribe(0, { stream: 'color', width: 1280, height: 720 }, frame =>
        console.log(frame.meta.stream, frame.meta.format)
      )

      setTimeout(function () {
        Realsense.unsubscribe(subscription)
        done()
      }, 2000)
    })

    it('should have infrared frame', done => {
      var subscription = Realsense.subscribe(0, { stream: 'infrared', index: 1, width: 1280, height: 720 }, frame =>
        console.log(frame.meta.stream, frame.meta.format)
      )
      setTimeout(function () {
        Realsense.unsubscribe(subscription)
        done()
      }, 2000)
    })

    it('should be able to change options during streaming', done => {
      var sensor = Realsense.getDevice(0).getSensorByName(SENSOR.STEREO)

      var options = sensor.options
      var exposureOption = options.find(option => option.option == 'exposure')
      var { minValue, maxValue, defaultValue, step } = exposureOption.range

      sensor.setOption('exposure', defaultValue)

      var subscription = Realsense.subscribe(0, { stream: 'infrared', index: 1, width: 1280, height: 720 }, frame => {
        sensor.setOption('exposure', sensor.getOption('exposure') + step)
        console.log(frame.meta.stream, 'exposure', sensor.getOption('exposure'))
      })

      setTimeout(function () {
        Realsense.unsubscribe(subscription)
        done()
      }, 2000)
    })

    it('should have depth and infrared frame', done => {
      var subscription1 = Realsense.subscribe(0, { stream: 'infrared', index: 1, width: 1280, height: 720 }, frame =>
        console.log(frame.meta.stream, frame.meta.format)
      )
      setTimeout(function () {
        var subscription2 = Realsense.subscribe(0, { stream: 'depth', width: 1280, height: 720 }, frame =>
          console.log(frame.meta)
        )
        setTimeout(function () {
          Realsense.unsubscribe(subscription2)
          done()
        }, 2000)
      }, 2000)
      setTimeout(function () {
        Realsense.unsubscribe(subscription1)
      }, 2000)
    })

    it('should have color and infrared frame', done => {
      var subscription1 = Realsense.subscribe(0, { stream: 'infrared', index: 1, width: 1280, height: 720 }, frame =>
        console.log(frame.meta.stream, frame.meta.format)
      )
      var subscription2 = Realsense.subscribe(0, { stream: 'color', width: 1280, height: 720 }, frame =>
        console.log(frame.meta.stream, frame.meta.format)
      )

      setTimeout(function () {
        Realsense.unsubscribe(subscription1)
        Realsense.unsubscribe(subscription2)
        done()
      }, 2000)
    })
  })
})
