export const OPTIONS = [
  {
    option: 'exposure',
    value: 8500,
    range: { minValue: 1, maxValue: 165000, step: 1, defaultValue: 8500 }
  },
  {
    option: 'gain',
    value: 16,
    range: { minValue: 16, maxValue: 248, step: 1, defaultValue: 16 }
  },
  {
    option: 'enable-auto-exposure',
    value: 1
  },
  {
    option: 'visual-preset',
    value: 0,
    range: { minValue: 0, maxValue: 6, step: 1, defaultValue: 0 }
  },
  {
    option: 'laser-power',
    value: 150,
    range: { minValue: 0, maxValue: 360, step: 30, defaultValue: 150 }
  },
  {
    option: 'emitter-enabled',
    value: 1,
    values: [0, 1, 2]
  },
  {
    option: 'frames-queue-size',
    value: 16,
    range: { minValue: 0, maxValue: 32, step: 1, defaultValue: 16 }
  },
  {
    option: 'error-polling-enabled',
    value: 1
  },
  {
    option: 'output-trigger-enabled',
    value: 0
  },
  {
    option: 'depth-units',
    value: 0.0010000000474974513,
    range: {
      minValue: 9.999999974752427e-7,
      maxValue: 0.009999999776482582,
      step: 9.999999974752427e-7,
      defaultValue: 0.0010000000474974513
    }
  },
  {
    option: 'stereo-baseline',
    value: 50.123226165771484,
    range: {
      minValue: 50.123226165771484,
      maxValue: 50.123226165771484,
      step: 0,
      defaultValue: 50.123226165771484
    }
  },
  {
    option: 'inter-cam-sync-mode',
    value: 0,
    values: [0, 1, 2]
  },
  {
    option: 'emitter-on-off',
    value: 0
  },
  {
    option: 'global-time-enabled',
    value: 1
  }
]
