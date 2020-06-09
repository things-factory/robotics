/**
 * 이 클래스는 realsense-camera 의 설정을 위한 에디터로 동작한다.
 */

import { LitElement, html, css } from 'lit-element'
import { ScrollbarStyles } from '@things-factory/styles'
import { i18next, localize } from '@things-factory/i18n-base'

import { RealsenseClient } from '../camera/realsense/realsense-client'
import { RealsenseColorStream } from '../camera/realsense/realsense-color-stream'
import { RealsenseDepthStream } from '../camera/realsense/realsense-depth-stream'
import { RealsenseInfraredStream } from '../camera/realsense/realsense-infrared-stream'

import { OPTIONS } from '../camera/realsense/realsense-options'

import '@material/mwc-icon'
import '@material/mwc-slider'
import '@material/mwc-checkbox'
import '@material/mwc-radio'
import '@material/mwc-button'

export class RealsenseCameraSettingPopup extends LitElement {
  static get styles() {
    return [
      ScrollbarStyles,
      css`
        :host {
          display: flex;
          flex-direction: column;

          align-items: stretch;
          background-color: #fff;

          width: var(--overlay-center-normal-width, 50%);
          height: var(--overlay-center-normal-height, 50%);
        }

        content {
          flex: 1;

          display: flex;
          flex-direction: row;

          overflow: auto;
        }

        [settings] {
          flex: 2;

          padding: 20px;

          overflow-y: auto;
          overflow-x: none;
        }

        label {
          display: block;
        }

        mwc-slider {
          display: block;
        }

        [stream] {
          flex: 3;

          margin: auto;
        }

        .button-container {
          display: flex;
          margin-left: auto;
        }

        canvas {
          display: block;
          width: 90%;

          margin: auto;
          border: 3px solid #73ad21;
          padding: 10px;
        }
      `
    ]
  }

  static get properties() {
    return {
      value: Object,
      device: Number,
      sensor: Number,
      stream: String
    }
  }

  disconnectedCallback() {
    this.rs2client?.disconnect()
  }

  firstUpdated() {}

  render() {
    var sensor = this.sensor || '0'
    var options = OPTIONS

    return html`
      <content>
        <div settings>
          <label>sensor</label>
          <select name="sensor" @change=${this.onStreamChange.bind(this)}>
            <option value="0">RGB Camera</option>
            <option value="1">Stereo Camera</option>
          </select>

          ${sensor == '0'
            ? html`
                <label>stream</label>
                <select name="stream" @change=${this.onStreamChange.bind(this)}>
                  <option value="" selected></option>
                  <option>color</option>
                </select>

                <label>resolution</label>
                <select>
                  <option>1920x1080</option>
                  <option>1280x720</option>
                  <option>960x540</option>
                  <option>848x480</option>
                  <option>640x480</option>
                  <option>640x360</option>
                  <option>424x240</option>
                  <option>320x240</option>
                  <option>320x180</option>
                </select>

                <label>format</label>
                <select>
                  <option>rgb8</option>
                  <option>raw16</option>
                  <option>y16</option>
                  <option>bgra8</option>
                  <option>rgba8</option>
                  <option>bgr8</option>
                  <option>yuyv</option>
                  <option>rgb8</option>
                </select>

                <label>FPS</label>
                <select>
                  <option>60</option>
                  <option>30</option>
                  <option>15</option>
                  <option>6</option>
                </select>
              `
            : html`
                <label>stream</label>
                <select name="stream" @change=${this.onStreamChange.bind(this)}>
                  <option value="" selected></option>
                  <option>depth</option>
                  <option>infrared-1</option>
                  <option>infrared-2</option>
                </select>

                <label>resolution</label>
                <select>
                  <option>1280x800</option>
                  <option>1280x720</option>
                  <option>848x480</option>
                  <option>848x100</option>
                  <option>640x480</option>
                  <option>640x400</option>
                  <option>640x360</option>
                  <option>480x270</option>
                  <option>424x240</option>
                  <option>256x144</option>
                </select>

                <label>format</label>
                <select>
                  <option>z16</option>
                  <option>y8</option>
                  <option>y16</option>
                </select>

                <label>FPS</label>
                <select>
                  <option>100</option>
                  <option>90</option>
                  <option>60</option>
                  <option>30</option>
                  <option>25</option>
                  <option>15</option>
                </select>
              `}
          <div
            @change=${e => {
              var option = e.target.getAttribute('name')
              var value = e.target.getAttribute('checkbox') ? (e.target.selected ? 1 : 0) : e.target.value
              this.rs2client.sendRequest({
                tag: 'set-setting',
                setting: {
                  [option]: value
                }
              })
            }}
            options
          >
            ${options.map(
              option => html`
                <label>${option.option}</label>
                ${option.range
                  ? html`
                      <mwc-slider
                        name=${option.option}
                        pin
                        markers
                        max=${option.range.maxValue}
                        min=${option.range.minValue}
                        value=${option.value}
                        step=${option.range.step}
                      ></mwc-slider>
                    `
                  : option.values
                  ? option.values.map(
                      value =>
                        html`
                          <mwc-radio name=${option.option} .checked=${value == option.value} value=${value}
                            >${value}</mwc-radio
                          >
                        `
                    )
                  : html` <mwc-checkbox name=${option.option} .checked=${option.value == 1} checkbox></mwc-checkbox> `}
              `
            )}
          </div>
        </div>

        <div stream>
          <canvas></canvas>
        </div>
      </content>

      <div class="button-container">
        <mwc-button @click=${this.oncancel.bind(this)}>${i18next.t('button.cancel')}</mwc-button>
        <mwc-button @click=${this.onconfirm.bind(this)}>${i18next.t('button.confirm')}</mwc-button>
      </div>
    `
  }

  onchange(e) {
    e.stopPropagation()

    /* 
      주의 : 이 팝업 템플릿은 layout 모듈에 의해서 render 되므로, 
      layout의 구성에 변화가 발생하면, 다시 render된다.
      이 팝업이 떠 있는 상태에서, 또 다른 팝업이 뜨는 경우도 layout 구성의 변화를 야기한다. (overlay의 갯수의 증가)
      이 경우 value, options, confirmCallback 등 클로져를 사용한 것들이 초기 바인딩된 값으로 다시 바인딩되게 되는데,
      만약, 템플릿 내부에서 이들 속성의 레퍼런스가 변화했다면, 원래 상태로 되돌아가는 현상이 발생하게 된다.
      따라서, 가급적 이들 속성의 레퍼런스를 변화시키지 않는 것이 좋다.
      (이 팝업 클래스를 템플릿으로 사용한 곳의 코드를 참조하세요.)
      => 
      이런 이유로, Object.assign(...)을 사용하였다.
    */
    if (!this.value) {
      this.value = {}
    }

    for (let key in this.value) {
      delete this.value[key]
    }
    Object.assign(this.value, e.detail)
  }

  onStreamChange(e) {
    var device = this.device || 0
    var sensor = (this.sensor = this.renderRoot.querySelector('[name=sensor]').value)
    var stream = (this.stream = this.renderRoot.querySelector('[name=stream]').value)

    var oldCanvas = this.renderRoot.querySelector('canvas')
    var canvas = oldCanvas.cloneNode(false)
    oldCanvas.parentNode.replaceChild(canvas, oldCanvas)

    if (this.rs2client) {
      this.rs2client.disconnect()
    }

    if (!sensor || !stream) {
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

  oncancel(e) {
    history.back()
  }

  onconfirm(e) {
    this.confirmCallback && this.confirmCallback(this.value ? JSON.stringify(this.value) : '')
    history.back()
  }
}

customElements.define('realsense-camera-setting-popup', RealsenseCameraSettingPopup)
