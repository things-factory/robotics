import { LitElement, html, css } from 'lit-element'
import { connect } from 'pwa-helpers/connect-mixin.js'
import { store } from '@things-factory/shell'
import '@material/mwc-button'

import { RealsenseClient } from '../../camera/realsense/realsense-client'
import { RealsenseColorStream } from '../../camera/realsense/realsense-color-stream'
import { RealsenseDepthStream } from '../../camera/realsense/realsense-depth-stream'
import { RealsenseInfraredStream } from '../../camera/realsense/realsense-infrared-stream'

import { WizardViewStyles } from '../../views/wizard-view-styles'

class CameraCalibrationOperation extends connect(store)(LitElement) {
  static get styles() {
    return [
      WizardViewStyles,
      css`
        canvas {
          width: 100%;
        }
      `
    ]
  }

  static get properties() {
    return {
      settings: Object
    }
  }

  disconnectedCallback() {
    this.rs2client?.disconnect()
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

      <div>
        Camera
        <select name="device" @change=${this.onStreamChange.bind(this)}>
          <option value="" selected></option>
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
      </div>

      <div>
        Stream
        <select name="stream" @change=${this.onStreamChange.bind(this)}>
          <option value="" selected></option>
          <option value="color">color</option>
          <option value="depth">depth</option>
          <option value="infrared-1">infrared-1</option>
          <option value="infrared-2">infrared-2</option>
        </select>
      </div>

      <canvas></canvas>
    `
  }

  onStreamChange(e) {
    var device = this.renderRoot.querySelector('[name=device]').value
    var stream = this.renderRoot.querySelector('[name=stream]').value

    var oldCanvas = this.renderRoot.querySelector('canvas')
    var canvas = oldCanvas.cloneNode(false)
    oldCanvas.parentNode.replaceChild(canvas, oldCanvas)

    if (this.rs2client) {
      this.rs2client.disconnect()
    }

    if (!device || !stream) {
      return
    }

    var profile = {}

    switch (stream) {
      case 'color':
        this.stream = new RealsenseColorStream(canvas)
        profile = {
          stream: 'color',
          index: 0
        }
        break

      case 'depth':
        this.stream = new RealsenseDepthStream(canvas)
        profile = {
          stream: 'depth',
          index: 0
        }
        break

      case 'infrared-1':
        this.stream = new RealsenseInfraredStream(canvas)
        profile = {
          stream: 'infrared',
          index: 1
        }
        break

      case 'infrared-2':
        this.stream = new RealsenseInfraredStream(canvas)
        profile = {
          stream: 'infrared',
          index: 2
        }
        break

      default:
        this.stream = null
    }

    if (this.stream) {
      this.rs2client = new RealsenseClient(3001, device, profile, data => {
        if (typeof data === 'string') {
          var meta = JSON.parse(data)
          this.stream.configure(meta)
        } else if (data instanceof Blob) {
          this.stream.stream(data)
        }
      })

      this.rs2client.connect()
    }
  }

  firstUpdated() {}
}

customElements.define('camera-calib-operation', CameraCalibrationOperation)
