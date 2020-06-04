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

  describe('channel-control', function () {
    this.timeout(20000)

    it('should stop sensor when no streams anymore', done => {
      var subscription = Realsense.subscribe(0, { stream: 'color', width: 1280, height: 720 }, frame =>
        console.log(frame.meta.stream, frame.meta.format)
      )

      expect(Object.keys(Realsense.subscriptions).length).be.equals(1)

      setTimeout(function () {
        Realsense.unsubscribe(subscription)
        expect(Object.keys(Realsense.subscriptions).length).be.equals(0)

        setTimeout(function () {
          done()
        }, 4000)
      }, 2000)
    })
  })
})
