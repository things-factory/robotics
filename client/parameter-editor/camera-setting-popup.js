/**
 * 이 클래스는 realsense-camera 의 설정을 위한 에디터로 동작한다.
 */

import { LitElement, html, css } from 'lit-element'
import { ScrollbarStyles } from '@things-factory/styles'
import { i18next, localize } from '@things-factory/i18n-base'

// import { CameraClient } from '../camera/camera-client'

import '@material/mwc-icon'
import '@material/mwc-slider'
import '@material/mwc-checkbox'
import '@material/mwc-radio'
import '@material/mwc-button'

const options = [
  {
    option: 'exposure',
    value: 8500,
    range: { minValue: 1, maxValue: 165000, step: 1, defaultValue: 8500 }
  },
  {
    option: 'gain',
    value: 16,
    range: { minValue: 16, maxValue: 248, step: 1, defaultValue: 16 }
  },
  {
    option: 'enable-auto-exposure',
    value: 1
  },
  {
    option: 'visual-preset',
    value: 0,
    range: { minValue: 0, maxValue: 6, step: 1, defaultValue: 0 }
  },
  {
    option: 'laser-power',
    value: 150,
    range: { minValue: 0, maxValue: 360, step: 30, defaultValue: 150 }
  },
  {
    option: 'emitter-enabled',
    value: 1,
    values: [0, 1, 2]
  },
  {
    option: 'frames-queue-size',
    value: 16,
    range: { minValue: 0, maxValue: 32, step: 1, defaultValue: 16 }
  },
  {
    option: 'error-polling-enabled',
    value: 1
  },
  {
    option: 'output-trigger-enabled',
    value: 0
  },
  {
    option: 'depth-units',
    value: 0.0010000000474974513,
    range: {
      minValue: 9.999999974752427e-7,
      maxValue: 0.009999999776482582,
      step: 9.999999974752427e-7,
      defaultValue: 0.0010000000474974513
    }
  },
  {
    option: 'stereo-baseline',
    value: 50.123226165771484,
    range: {
      minValue: 50.123226165771484,
      maxValue: 50.123226165771484,
      step: 0,
      defaultValue: 50.123226165771484
    }
  },
  {
    option: 'inter-cam-sync-mode',
    value: 0,
    values: [0, 1, 2]
  },
  {
    option: 'emitter-on-off',
    value: 0
  },
  {
    option: 'global-time-enabled',
    value: 1
  }
]

export class CameraSettingPopup extends LitElement {
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

          font-size: 14px;
        }

        content {
          flex: 1;

          display: flex;
          flex-direction: row;

          overflow: auto;
          padding: 20px 20px 20px 0;
        }

        [settings] {
          flex: 2;
          overflow: auto;
        }

        fieldset {
          border-width: 0 0 1px 0;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          padding: 0 20px 10px 20px;
        }
        label {
          display: block;
          text-align: right;
          color: var(--secondary-text-color);
          text-transform: capitalize;
        }
        fieldset [column1],
        fieldset [column2] {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 10px 5px;
          padding-bottom: 10px;
        }
        fieldset [column1] label,
        fieldset [column2] label {
          grid-column: span 1 / auto;
        }
        fieldset [column2] select {
          grid-column: span 2 / auto;
        }
        fieldset [column1] > *:not(label) {
          grid-column: span 5 / auto;
        }

        mwc-slider {
          display: block;
        }

        [stream] {
          flex: 2;
          position: relative;
        }

        .button-container {
          display: flex;
          margin-left: auto;
        }
        [msg] {
          background-color: #303030;
          width: 100%;
          min-height: 180px;
          padding-top: 20%;
          text-align: center;
          font-size: 0.8em;
          color: rgba(255, 255, 255, 0.5);
          text-transform: capitalize;
        }
        [msg] mwc-icon {
          display: block;
          font-size: 36px;
        }
        canvas {
          display: block;
          min-height: 300px;
          position: absolute;
          top: 0px;
          left: 0px;
          width: 100%;
        }
      `
    ]
  }

  static get properties() {
    return {
      value: Object
    }
  }

  disconnectedCallback() {
    this.webcamClient.disconnect()
  }

  // firstUpdated() {
  //   var device = '0'
  //   var canvas = this.renderRoot.querySelector('canvas')
  //   var context = canvas.getContext('2d')
  //   var count = 0

  //   this.webcamClient = new CameraClient(3001, 'webcam', device, {}, data => {
  //     if (count++ == 0) {
  //       var { width, height } = JSON.parse(data)
  //       canvas.width = width
  //       canvas.height = height

  //       return
  //     }

  //     var image = new Image()
  //     image.src = 'data:image/jpeg;base64,' + data
  //     image.onload = () => {
  //       context.drawImage(image, 0, 0)
  //       URL.revokeObjectURL(data)
  //     }
  //   })

  //   this.webcamClient.connect()
  // }

  render() {
    var { sensor = '0' } = this.value || {}

    return html`
      <content>
        <div settings>
          <fieldset>
            <div column2>
              <label>sensor</label>
              <select>
                <option value="0">RGB Camera</option>
                <option value="1">Stereo Camera</option>
              </select>
            </div>
            ${sensor == '0'
              ? html`
                  <div column2>
                    <label>stream</label>
                    <select>
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
                  </div>
                `
              : html`
                  <div column2>
                    <label>stream</label>
                    <select>
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
                  </div>
                `}
            ${options.map(
              option => html`
               <div column1>
                  <label>${option.option}</label>
                  ${
                    option.range
                      ? html`
                          <mwc-slider
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
                              <mwc-radio name=${option.option} .checked=${value == option.value}>${value}</mwc-radio>
                            `
                        )
                      : html` <mwc-checkbox .checked=${option.value == 1}></mwc-checkbox> </div>`
                  }
                </fieldset>
              `
            )}
          </fieldset>
        </div>

        <div stream>
          <div msg><mwc-icon>camera</mwc-icon>turn on the camera.</div>
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

  oncancel(e) {
    history.back()
  }

  onconfirm(e) {
    this.confirmCallback && this.confirmCallback(this.value ? JSON.stringify(this.value) : '')
    history.back()
  }
}

customElements.define('camera-setting-popup', CameraSettingPopup)
