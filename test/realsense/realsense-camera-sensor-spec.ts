import { expect } from 'chai'
import { SENSOR, Realsense } from '../../server/controllers/realsense'

describe('RealsenseCameraSensor', function () {
  before(function () {
    Realsense.init()
  })

  after(function () {
    Realsense.cleanup()
  })

  describe('name', function () {
    it('should have sensor name', function () {
      var device = Realsense.getDevice(0)
      var sensors = device?.sensors
      var sensorNames = device?.sensors.map(sensor => sensor.name)

      expect(sensorNames).to.include(SENSOR.RGB)
      expect(sensorNames).to.include(SENSOR.STEREO)
    })
  })

  describe('info', function () {
    it('should have sensor infomations', function () {
      var device = Realsense.getDevice(0)
      var sensors = device?.sensors

      console.log('sensor.info', sensors[0]?.info)
    })
  })

  describe('options', function () {
    it('should have sensor options', function () {
      var device = Realsense.getDevice(0)
      var sensors = device?.sensors

      console.log('sensor.options', sensors[0]?.options)
    })
  })

  describe('setOption', function () {
    it('should change option', function () {
      var camera = Realsense.getDevice(0)
      var sensor = camera.getSensorByName(SENSOR.RGB)

      sensor.setOption('exposure', 8572)
      var exposure = sensor.getOption('exposure')

      expect(exposure).be.equals(8572)
    })
  })

  describe('findProfiles', function () {
    it('should have matching profiles', function () {
      var device = Realsense.getDevice(0)
      var sensor = device.getSensorByName(SENSOR.STEREO)
      var profiles = sensor.info.profiles

      profiles.forEach(profile => {
        var { width, height, fps, format, stream, index } = profile
        var [matching] = sensor
          .findProfiles([
            {
              width,
              height,
              fps,
              format,
              stream,
              index
            }
          ])
          .map(m => sensor.convertProfile(m))

        expect(matching.format).to.be.equals(profile.format)
        expect(matching.stream).to.be.equals(profile.stream)
        expect(matching.fps).to.be.equals(profile.fps)
        expect(matching.width).to.be.equals(profile.width)
        expect(matching.height).to.be.equals(profile.height)
      })
    })
  })
})
