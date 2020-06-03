import { expect } from 'chai'
import { SENSOR, Realsense, STREAM } from '../../server/engine/connector/realsense'

describe('RealsenseCamera', function () {
  before(function () {
    Realsense.init()
  })

  after(function () {
    Realsense.cleanup()
  })

  describe('findSensorSupportingStream', function () {
    it('should find stereo sensor supporting infrared stream', function () {
      var camera = Realsense.getDevice(0)
      var sensor = camera.findSensorSupportingStream(STREAM.INFRARED)

      expect(sensor.name).to.equals(SENSOR.STEREO)
    })

    it('should find RGB sensor supporting color stream', function () {
      var camera = Realsense.getDevice(0)
      var sensor = camera.findSensorSupportingStream(STREAM.COLOR)

      expect(sensor.name).to.equals(SENSOR.RGB)
    })
  })
})
