module.exports = {
  vision: {
    camera: {
      cameraCalibrator: {
        program: ['python', '/Users/hatiolab/Documents/python3-work/vision-client-python/sample_camera_calibrator.py']
      },
      handEyeCalibrator: {
        program: ['python', '/Users/super/Documents/Things-Factory/vision-client-python/sample_roi_detector.py']
      },
      ROIDetector: {
        program: ['python', '/Users/super/Documents/Things-Factory/vision-client-python/sample_roi_detector.py']
      }
    },
    robotArm: {
      markerOffsetCalibrator: {
        program: ['python', '/Users/super/Documents/Things-Factory/vision-client-python/sample_roi_detector.py']
      }
    },
    objectTracker: {
      program: ['python', '/Users/super/Documents/Things-Factory/vision-client-python/sample_roi_detector.py']
    }
  }
}
