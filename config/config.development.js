module.exports = {
  vision: {
    streamingPort: 3001,
    camera: {
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
