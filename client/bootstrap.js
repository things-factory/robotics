import { store } from '@things-factory/shell'
import { ADD_MODELLER_EDITORS } from '@things-factory/modeller-ui'

import './parameter-editor/camera-setting-editor'
import './parameter-editor/camera-calibration-editor'
import './parameter-editor/camera-roi-editor'
import './parameter-editor/offset-pose-editor'
import './parameter-editor/handeye-calibration-editor'
import './parameter-editor/realsense-camera-setting-editor'

export default function bootstrap() {
  store.dispatch({
    type: ADD_MODELLER_EDITORS,
    editors: {
      'camera-setting': 'camera-setting-editor',
      'camera-calibration': 'camera-calibration-editor',
      'camera-roi': 'camera-roi-editor',
      'offset-pose': 'offset-pose-editor',
      'handeye-calibration': 'handeye-calibration-editor',
      'realsense-camera-setting': 'realsense-camera-setting-editor'
    }
  })
}
