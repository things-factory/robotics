import { html } from 'lit-html'
import { store, navigate } from '@things-factory/shell'
import { ADD_MORENDA } from '@things-factory/more-base'

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
}
