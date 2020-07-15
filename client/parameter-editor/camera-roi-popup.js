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

export class CameraROIPopup extends LitElement {
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

        [roi-setting] {
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
        fieldset:nth-child(even) {
          background-color: var(--main-section-background-color);
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
        fieldset [roi-cell] {
          clear: both;
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          gap: 10px 5px;
        }
        fieldset mwc-button {
          --mdc-theme-primary: #666;
          float: right;
        }
        .mdc-button .mdc-button__icon {
          margin-right: 0px;
        }

        [roi] input {
          min-width: 100px;
          grid-column: span 3 / auto;
        }
        [roi] span {
          grid-column: span 3 / auto;
        }

        label {
          display: block;
          text-align: right;
          grid-column: span 2 / auto;
          color: var(--secondary-text-color);
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
      value: Array,
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
  //   var camera = this.host?.name

  //   this.webcamClient = new CameraClient(3001, camera, device, {}, data => {
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
    var rois = this.value instanceof Array ? this.value : []

    return html`
      <content>
        <div roi-setting>
          <div @change=${e => this.onchange(e)}>
            ${rois.map(roi => {
              var { id = '', region = {} } = roi

              var x1 = region.lt?.x || 0
              var y1 = region.lt?.y || 0
              var x2 = region.rb?.x || 0
              var y2 = region.rb?.y || 0

              return html`
                <fieldset roi added>
                  <legend>camera #</legend>
                  <mwc-button dense @click=${e => this.onClickDelete(e)} icon="highlight_off"
                    >${i18next.t('button.delete')}</mwc-button
                  >
                  <div roi-cell>
                    <label>ID</label>
                    <input type="text" value=${id} />
                    <span></span>
                    <label>Left-Top</label>
                    <input type="number" .value=${x1} placeholder="X" />
                    <input type="number" .value=${y1} placeholder="Y" />
                    <label>Right-Bottom</label>
                    <input type="number" .value=${x2} placeholder="X" />
                    <input type="number" .value=${y2} placeholder="Y" />
                  </div>
                </fieldset>
              `
            })}

            <fieldset roi add>
              <legend>camera #</legend>
              <mwc-button dense @click=${e => this.onClickAdd()} icon="add_circle_outline"
                >${i18next.t('button.add')}</mwc-button
              >
              <div roi-cell>
                <label>ID</label>
                <input type="text" />
                <span></span>
                <label>Left-Top</label>
                <input type="number" placeholder="X" />
                <input type="number" placeholder="Y" />
                <label>Right-Bottom</label>
                <input type="number" placeholder="X" />
                <input type="number" placeholder="Y" />
              </div>
            </fieldset>
          </div>

          <div button-group>
            <mwc-button dense label="Take Snapshot" icon="wallpaper"></mwc-button>
            <mwc-button dense label="Reset" class="alignL"></mwc-button>
            <mwc-button dense label="Detect" icon="exposure" @click=${this.detectROIs.bind(this)}></mwc-button>
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

  async detectROIs() {
    var name = this.host?.name

    const response = await client.query({
      query: gql`
        query($name: String!) {
          detectTrackingCameraROIs(name: $name) {
            id
            region {
              lt {
                x
                y
              }
              rb {
                x
                y
              }
            }
          }
        }
      `,
      variables: {
        name
      }
    })

    var rois = response.data.detectTrackingCameraROIs
    console.log('detected rois', rois)
    this.value = rois
  }

  extractRoi(div) {
    var inputs = div.querySelectorAll('input')
    var [id, x1, y1, x2, y2] = Array.from(inputs).map(input => input.value)

    return {
      id,
      region: {
        lt: {
          x: x1,
          y: y1
        },
        rb: {
          x: x2,
          y: y2
        }
      }
    }
  }

  onClickAdd() {
    this.value = [...(this.value || []), this.extractRoi(this.renderRoot.querySelector('fieldset[add]'))]

    var inputs = this.renderRoot.querySelectorAll('fieldset[add] input')
    Array.from(inputs).forEach(input => (input.value = ''))
  }

  onClickDelete(e) {
    var target = e.target
    var parent = target.parentElement

    var rois = this.renderRoot.querySelectorAll('fieldset[added]')
    var value = Array.from(rois)
      .filter(roi => parent !== roi)
      .map(roi => this.extractRoi(roi))

    this.value = value
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
    var rois = this.renderRoot.querySelectorAll('fieldset[added]')
    this.value = Array.from(rois).map(roi => this.extractRoi(roi))
  }

  oncancel(e) {
    history.back()
  }

  onconfirm(e) {
    this.confirmCallback && this.confirmCallback(this.value || [])
    history.back()
  }
}

customElements.define('camera-roi-popup', CameraROIPopup)
