import { LitElement, html, css } from 'lit-element'
import { connect } from 'pwa-helpers/connect-mixin.js'
import { store } from '@things-factory/shell'

class CameraSetting extends connect(store)(LitElement) {
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
