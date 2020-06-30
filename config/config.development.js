module.exports = {
  vision: {
    streamingPort: 3001,
    camera: {
      handEyeCalibrator: {
        program: ['python', '/Users/hatiolab/Documents/python3-work/vision-client-python/sample_handeye_calibrator.py']
      },
      ROIDetector: {
        program: ['python', '/Users/hatiolab/Documents/python3-work/vision-client-python/sample_roi_detector.py']
      }
    },
    robotArm: {
      markerOffsetCalibrator: {
        program: ['python', '/Users/hatiolab/Documents/python3-work/vision-client-python/sample_roi_detector.py']
      }
    },
    objectTracker: {
      program: ['python', '/Users/hatiolab/Documents/python3-work/vision-client-python/sample_roi_detector.py']
    }
  }
}
