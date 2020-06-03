import { LitElement, html, css } from 'lit-element'
import { connect } from 'pwa-helpers/connect-mixin.js'
import { store } from '@things-factory/shell'

import { WizardViewStyles } from '../../views/wizard-view-styles'

class CameraSetting extends connect(store)(LitElement) {
  static get styles() {
    return [WizardViewStyles, css``]
  }

  static get properties() {
    return {
      settings: Object
    }
  }

  render() {
    return html`
      <h3>camera setting</h3>

      <div>
        Sensor mount type
        <select>
          <option>Eye-to-Hand</option>
          <option>Eye-in-Hand</option>
        </select>
      </div>

      <div>
        AX=XB solver
        <select>
          <option>handeye</option>
          <option>Eye-in-Hand</option>
        </select>
      </div>

      <img
        src="https://www.intel.co.kr/content/dam/www/public/us/en/images/product/16x9/depth-camera-16x9.png.rendition.intel.web.416.234.png"
      />
    `
  }
}

customElements.define('camera-setting', CameraSetting)
