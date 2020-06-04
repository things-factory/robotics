import { expect } from 'chai'
import rs2 from '@things-factory/node-librealsense2'
import { Realsense, SENSOR } from '../../server/controllers/realsense'

describe('Realsense', function () {
  before(function () {
    Realsense.init()
  })

  after(function () {
    Realsense.cleanup()
  })

  describe('devices', function () {
    it('should have connected devices', function () {
      var device = Realsense.devices[0]
      var sensors = device?.sensors
    })
  })

  describe('presets', function () {
    it('should have high-accuracy preset', function () {
      console.log(Realsense.presets)
      var presets = Realsense.presets

      expect(presets).to.include('custom')
      expect(presets).to.include('default')
      expect(presets).to.include('hand')
      expect(presets).to.include('high-accuracy')
      expect(presets).to.include('high-density')
      expect(presets).to.include('medium-density')
      expect(presets).to.include('remove-ir-pattern')
    })
  })
})
