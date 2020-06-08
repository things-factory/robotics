/**
 * 이 클래스는 camera 의 설정을 위한 에디터로 동작한다.
 */

import { LitElement, html, css } from 'lit-element'
import { i18next, localize } from '@things-factory/i18n-base'
import { openPopup } from '@things-factory/layout-base'
import { ThingsEditorProperty, ThingsEditorPropertyStyles } from '@things-factory/modeller-ui'
import '@material/mwc-icon'

import './camera-roi-popup'

export class CameraROIEditor extends ThingsEditorProperty {
  static get styles() {
    return [ThingsEditorPropertyStyles]
  }

  static get properties() {
    return {
      value: Object
    }
  }

  editorTemplate(props) {
    return html`<mwc-button @click=${e => this.openROISetup()}>${i18next.t('text.camera roi')}</mwc-button>`
  }

  async openROISetup() {
    if (this.popup) {
      delete this.popup
    }

    const confirmCallback = newval => {
      this.dispatchEvent(
        new CustomEvent('change', {
          bubbles: true,
          composed: true,
          detail: this.value
        })
      )
    }

    /* 
      주의 : 이 팝업 템플릿은 layout 모듈에 의해서 render 되므로, 
      layout의 구성에 변화가 발생하면, 다시 render된다.
      이 팝업이 떠 있는 상태에서, 또 다른 팝업이 뜨는 경우도 layout 구성의 변화를 야기한다. (overlay의 갯수의 증가)
      이 경우 value, options, confirmCallback 등 클로져를 사용한 것들이 초기 바인딩된 값으로 다시 바인딩되게 되는데,
      만약, 템플릿 내부에서 이들 속성의 레퍼런스가 변화했다면, 원래 상태로 되돌아가는 현상이 발생하게 된다.
      따라서, 가급적 이들 속성의 레퍼런스를 변화시키지 않는 것이 좋다.
    */
    var template = html`
      <camera-roi-popup .value=${this.value} .confirmCallback=${confirmCallback}> </camera-roi-popup>
    `

    this.popup = openPopup(template, {
      backdrop: true,
      size: 'large',
      title: i18next.t('text.camera roi')
    })
  }
}

customElements.define('camera-roi-editor', CameraROIEditor)
