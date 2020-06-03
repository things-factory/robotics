import { LitElement, html, css } from 'lit-element'
import { connect } from 'pwa-helpers/connect-mixin.js'
import { store } from '@things-factory/shell'
import '@material/mwc-button'

import { RealsenseClient } from '../../camera/realsense-client'
import { RealsenseColorStream } from '../../camera/realsense-color-stream'

import { WizardViewStyles } from '../../views/wizard-view-styles'

class CameraCalibrationOperation extends connect(store)(LitElement) {
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
    var sensorName = 'RGB Camera'
    var streams = ['color']

    this.colorStream = new RealsenseColorStream(canvas)

    this.rs2client = new RealsenseClient(0, data => {
      /* how to tell target - infraredStream1, 2, color, depth */
      // console.log(JSON.parse(data))
      /* data should be a Blob or String */
      if (typeof data === 'string') {
        this.colorStream.configure(JSON.parse(data))
      } else if (data instanceof Blob) {
        this.colorStream.stream(data)
        // } else {
        //   // data instanceof ArrayBuffer
        //   // ASSERT(false)
      }
    })

    this.rs2client.connect()
    setTimeout(() => {
      this.rs2client.commandStartStream(sensorName, [
        {
          stream: 'color',
          format: 'rgb8',
          fps: 30,
          resolution: '1920*1080',
          index: 0
        }
      ])
    }, 2000)
  }
}

customElements.define('camera-calib-operation', CameraCalibrationOperation)
