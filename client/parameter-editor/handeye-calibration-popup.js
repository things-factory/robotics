/**
 * 이 클래스는 realsense-camera 의 설정을 위한 에디터로 동작한다.
 */

import { LitElement, html, css } from 'lit-element'
import gql from 'graphql-tag'
import { client } from '@things-factory/shell'
import { ScrollbarStyles } from '@things-factory/styles'
import { i18next, localize } from '@things-factory/i18n-base'

// import { CameraClient } from '../camera/camera-client'

import '@material/mwc-icon'
import '@material/mwc-button'

const ZEROS = new Array(16).fill(0)

export class HandEyeCalibrationPopup extends LitElement {
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
          padding: 20px 20px 20px 0;
        }

        [calibration] {
          flex: 2;

          overflow-y: auto;
          overflow-x: none;
        }
        fieldset {
          border-width: 0 0 1px 0;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          padding: 10px 20px;
        }
        fieldset:first-child {
          padding-top: 0px;
        }

        legend {
          float: left;
          padding: 0;
          margin-top: -5px;
          margin-bottom: 5px;
          text-transform: capitalize;
          font-weight: bold;
          color: var(--secondary-text-color);
        }

        [stream] {
          flex: 2;
          position: relative;
        }

        [matrix] {
          clear: both;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px 5px;
        }

        [matrix] * {
          min-width: 100px;
        }

        .button-container {
          display: flex;
          margin-left: auto;
        }
        [msg] {
          background-color: #303030;
          width: 100%;
          min-height: 180px;
          padding-top: 120px;
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
        [button-group] {
          padding: 10px 20px 0 15px;
          text-align: right;
        }
        [button-group] mwc-button {
          --mdc-theme-primary: #fff;
          background-color: var(--secondary-color);
          border-radius: var(--border-radius);
          margin: 0 0 5px 5px;
          padding-bottom: 2px;
        }
        [button-group] .alignL {
          float: left;
          background-color: #747474;
        }
      `
    ]
  }

  static get properties() {
    return {
      value: Object,
      host: Object
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
    var { rows = 4, columns = 4, data = [...ZEROS] } = this.value || {}
    var values = [...(data || []), ...ZEROS].slice(0, 16)

    return html`
      <content>
        <div calibration>
          <fieldset>
            <legend>handeye matrix</legend>
            <div matrix @change=${e => this.onchange(e)}>
              ${values.map(value => html` <input type="number" .value=${value} /> `)}
            </div>
          </fieldset>

          <div button-group>
            <mwc-button
              dense
              label="Start Teaching"
              icon="play_circle_outline"
              @click=${this.startTeachingMode.bind(this)}
            ></mwc-button>
            <mwc-button
              dense
              label="Finish Teaching"
              icon="pause_circle_outline"
              @click=${this.finishTeachingMode.bind(this)}
            ></mwc-button>
            <mwc-button dense label="Take Snapshot" icon="wallpaper"></mwc-button>
            <mwc-button dense label="Reset" class="alignL"></mwc-button>
            <mwc-button
              dense
              label="Calibrate"
              icon="exposure"
              @click=${this.calibrateHandeyeMatrix.bind(this)}
            ></mwc-button>
          </div>
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

  async calibrateHandeyeMatrix() {
    var name = this.host?.name

    const response = await client.query({
      query: gql`
        query($name: String!) {
          calibrateHandeyeMatrix(name: $name) {
            rows
            columns
            data
          }
        }
      `,
      variables: {
        name
      }
    })

    var handeyeMatrix = response.data.calibrateHandeyeMatrix
    console.log('calibrated handeye matrix', handeyeMatrix)
    this.value = handeyeMatrix
  }

  async startTeachingMode() {
    var { params } = this.host

    var { baseRobotArm } = JSON.parse(params)

    const response = await client.mutate({
      // [jw]
      mutation: gql`
        mutation($name: String!) {
          robotArmStartTeachingMode(name: $name)
        }
      `,
      variables: {
        name: baseRobotArm
      }
    })
  }

  async finishTeachingMode() {
    var { params } = this.host

    var { baseRobotArm } = JSON.parse(params)

    const response = await client.mutate({
      // [jw]
      mutation: gql`
        mutation($name: String!) {
          robotArmFinishTeachingMode(name: $name)
        }
      `,
      variables: {
        name: baseRobotArm
      }
    })
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
    var inputs = this.renderRoot.querySelectorAll('input')
    this.value = {
      rows: 4,
      columns: 4,
      data: Array.from(inputs).map(input => input.value)
    }
  }

  oncancel(e) {
    history.back()
  }

  onconfirm(e) {
    this.confirmCallback && this.confirmCallback(this.value)
    history.back()
  }
}

customElements.define('handeye-calibration-popup', HandEyeCalibrationPopup)
