/**
 * 이 클래스는 camera 의 설정을 위한 에디터로 동작한다.
 */

import { LitElement, html, css } from 'lit-element'
import { ThingsEditorProperty, ThingsEditorPropertyStyles } from '@things-factory/modeller-ui'
import '@material/mwc-button'

const LABELS = ['x', 'y', 'z', 'u', 'v', 'w']

export class OffsetPoseEditor extends ThingsEditorProperty {
  static get styles() {
    return [
      ThingsEditorPropertyStyles,
      css`
        :host {
          margin-top: 20px;
        }

        [offset] {
          display: grid;
          grid-template-columns: repeat(3, 1fr 4fr);
          column-gap: 4px;
          row-gap: 4px;
        }

        [offset] input {
          min-width: 60px;
        }

        label {
          text-align: right;
        }

        mwc-button {
          display: block;
          text-align: center;
        }
      `
    ]
  }

  static get properties() {
    return {
      value: Object
    }
  }

  editorTemplate(props) {
    return html`
      <div>
        <div offset @change=${e => this.onchange(e)}>
          ${LABELS.map(
            key => html`
              <label>${key}</label>
              <input type="number" value=${(this.value && this.value[key]) || 0} placeholder=${key} />
            `
          )}
        </div>
      </div>
    `
  }

  onchange(e) {
    var inputs = this.renderRoot.querySelectorAll('input')
    var values = Array.from(inputs).map(input => input.value)
    this.value = LABELS.reduce((sum, key, idx) => {
      sum[key] = values[idx]
      return sum
    }, {})

    e.stopPropagation()

    this.dispatchEvent(
      new CustomEvent('change', {
        bubbles: true,
        detail: this.value
      })
    )
  }
}

customElements.define('offset-pose-editor', OffsetPoseEditor)
