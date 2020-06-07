import { html } from 'lit-html'
import { store, navigate } from '@things-factory/shell'
import { ADD_MORENDA } from '@things-factory/more-base'
import { ADD_MODELLER_EDITORS } from '@things-factory/modeller-ui'

import './parameter-editor/realsense-camera-setting-editor'
import './parameter-editor/realsense-camera-calibration-editor'

export default function bootstrap() {
  store.dispatch({
    type: ADD_MORENDA,
    morenda: {
      icon: html` <mwc-icon>build</mwc-icon> `,
      name: html` <i18n-msg msgid="text.camera calibration"></i18n-msg> `,
      action: () => {
        navigate('camera-calib')
      }
    }
  })

  store.dispatch({
    type: ADD_MORENDA,
    morenda: {
      icon: html` <mwc-icon>build</mwc-icon> `,
      name: html` <i18n-msg msgid="text.handeye calibration"></i18n-msg> `,
      action: () => {
        navigate('handeye-calib')
      }
    }
  })

  store.dispatch({
    type: ADD_MODELLER_EDITORS,
    editors: {
      'realsense-camera-setting': 'realsense-camera-setting-editor',
      'realsense-camera-calibration': 'realsense-camera-calibration-editor'
    }
  })
}
