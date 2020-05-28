import { LitElement, html, css } from 'lit-element'
import { connect } from 'pwa-helpers/connect-mixin.js'
import { store } from '@things-factory/shell'
import '@material/mwc-button'

import { RealsenseClient } from '../../camera/realsense-client-sample'

class CameraCalibrationOperation extends connect(store)(LitElement) {
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
      mwc-button {
        --mdc-theme-primary: #fff;
        background-color: var(--wizard-view-button-background-color, #4c567f);
        margin: var(--wizard-view-button-margin, 10px 10px 10px 0);
        padding: var(--wizard-view-button-padding, 0px 5px);
        border-radius: var(--wizard-view-button-radius, 5px);
      }
      mwc-button:hover {
        background-color: var(--wizard-view-button-hover-background-color, #6e7ebd);
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
      <h3>Calibration Operation</h3>

      <div action>
        <mwc-button label="Take Snapshot" icon="wallpaper"></mwc-button>
        <mwc-button label="Reset" icon="flip_camera_android"></mwc-button>
        <mwc-button label="Compute" icon="exposure"></mwc-button>
        <mwc-button label="Publish" icon="publish"></mwc-button>
      </div>

      <canvas></canvas>
    `
  }

  firstUpdated() {
    var canvas = this.renderRoot.querySelector('canvas')

    this.colorStream = new RealsenseColorStream(canvas)

    this.cameraStream = new RealsenseClient(0, data => {
      /* how to tell target - infraredStream1, 2, color, depth */

      /* data should be a Blob or String */
      if (typeof e.data === 'string') {
        this.infraredStream1.configure(JSON.parse(data))
      } else if (data instanceof Blob) {
        this.infraredStream1.stream(data)
      } else {
        // data instanceof ArrayBuffer
        // ASSERT(false)
      }
    })

    this.cameraStream.connect()
  }
}

customElements.define('camera-calib-operation', CameraCalibrationOperation)
