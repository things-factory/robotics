import { html, css } from 'lit-element'
import { connect } from 'pwa-helpers/connect-mixin.js'
import { store, PageView } from '@things-factory/shell'

import '../views/wizard-view'

import './camera-calib/camera-setting'
import './camera-calib/calibrate-operation'

class CameraCalibration extends connect(store)(PageView) {
  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: row;
      }

      wizard-summary {
        flex: 1;
        background-color: var(--wizard-summary-background-color, #f4f7fb);
        padding: var(--wizard-padding, 15px);
        text-align: center;
      }

      h2 {
        background: url('data:image/png;base64,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')
          center top no-repeat;
        background-size: auto 120px;
        margin-bottom: 0;
        padding: 130px 0 0 0;
        color: var(--wizard-headline-color, #4c526b);
      }

      p {
        margin-top: 0;
        color: var(--wizard-headline-description-color, #6e7ebd);
        font-size: 13px;
      }

      ol {
        text-align: left;
        list-style: outside none none;
        counter-reset: big-numba;
        padding: 0;
      }

      li {
        list-style: outside none none;
        padding: 9px;
        color: var(--wizard-step-color, #4c526b);
        font-size: 16px;
      }

      li::before {
        content: counter(big-numba, decimal);
        counter-increment: big-numba;
        display: inline-block;
        margin-right: 5px;
        border-radius: 50%;
        width: var(--wizard-step-size, 22px);
        height: var(--wizard-step-size, 22px);
        line-height: 1.2em;
        background-color: #fff;
        border: 1px solid var(--wizard-step-color, #4c526b);
        text-align: center;
        font-size: var(--wizard-step-number-size, 17px);
      }

      li[active] {
        color: var(--wizard-step-active-color, #6e7ebd);
        font-weight: bold;
      }

      li[active]::before {
        background-color: var(--wizard-step-active-color, #6e7ebd);
        border-color: var(--wizard-step-active-color, #6e7ebd);
        color: #fff;
      }

      li[active]::after {
        content: '>';
        margin-left: 5px;
      }

      wizard-view {
        flex: 2;
        padding: var(--wizard-padding, 15px);
      }
    `
  }

  static get properties() {
    return {
      current: String
    }
  }

  render() {
    return html`
      <wizard-summary>
        <h2>Camera Calibration</h2>
        <p>Configure the position and orientation of your cameras to work with Operato</p>
        <ol>
          <li ?active=${this.current == 'camera-setting'}>Camera Setting</li>
          <li ?active=${this.current == 'operation'}>Calibration Operation</li>
        </ol>
      </wizard-summary>

      <wizard-view @change=${e => (this.current = e.detail.active?.getAttribute('name'))}>
        <camera-setting name="camera-setting"></camera-setting>
        <camera-calib-operation name="operation" .done=${() => this.done()}></camera-calib-operation>
      </wizard-view>
    `
  }

  done() {
    console.log('done....')

    this.renderRoot.querySelector('wizard-view').gotoStep(1)
  }
}

customElements.define('camera-calib', CameraCalibration)
