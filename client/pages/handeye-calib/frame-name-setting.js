import { LitElement, html, css } from 'lit-element'
import { connect } from 'pwa-helpers/connect-mixin.js'
import { store } from '@things-factory/shell'

class HandEyeCalibrationFrameNameSetting extends connect(store)(LitElement) {
  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: column;
      }
      h3 {
        margin: 0;
        color: var(--wizard-headline-color, #6e7ebd);
        text-transform: capitalize;
      }
      div {
        margin: var(--wizard-view-item-margin, 10px 0);
        padding: var(--wizard-view-item-padding, 5px 0);
        font-size: var(--wizard-view-font-size-default, 14px);
        color: var(--wizard-view-font-color, #4c526b);
      }
      input,
      select {
        display: block;
        border: 1px solid rgba(0, 0, 0, 0.2);
        min-width: var(--wizard-view-input-field-min, 90%);
        max-width: var(--wizard-view-input-field-max, 700px);
        padding: 2px 9px;
        font-size: var(--wizard-view-font-size-default, 18px);
      }
      img {
        flex: 1;
        margin: var(--wizard-view-item-margin, 10px 0);
      }
    `
  }

  static get properties() {
    return {
      settings: Object
    }
  }

  render() {
    return html`
      <h3>object detection setting</h3>

      <div>
        sensor frame
        <select>
          <option>AAA</option>
          <option>BBB</option>
        </select>
      </div>

      <div>
        object frame
        <select>
          <option>AAA</option>
          <option>BBB</option>
        </select>
      </div>

      <div>
        end-effector frame
        <select>
          <option>aruco board 5x7</option>
          <option>aruco board 5x7</option>
          <option>aruco board 5x7</option>
          <option>aruco board 5x7</option>
        </select>
      </div>
      <div>
        robot base frame
        <select>
          <option>aruco board 5x7</option>
          <option>aruco board 5x7</option>
          <option>aruco board 5x7</option>
          <option>aruco board 5x7</option>
        </select>
      </div>
    `
  }
}

customElements.define('handeye-calib-frame-name-setting', HandEyeCalibrationFrameNameSetting)
