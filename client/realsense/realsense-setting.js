import { LitElement, html, css } from 'lit-element'
import { ResponseTag, CommandTag, CommonNames } from './common'

export class RealsenseSetting {
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
      `
    ]
  }

  static get properties() {
    return {
      preset: Object,
      info: Object,
      res: Object,
      fps: Object,
      stream: Object,
      format: Object,
      option: Object
    }
  }

  connectedCallback() {
    this.proxy.connect()
  }

  render() {
    var preset
    var info = {}
    var res = {}
    var fps
    var stream = {}
    var format
    var option = {}

    return html`
      <div id="web-demo">
        <fieldset style="float:left;width:30%">
          <div v-if="sensorInfo.length > 0">
            <label>Presets</label>
            <select v-model="selection.selectedPreset">
              <option v-for="preset in presets">${preset}</option>
            </select>
            <div v-for="info in sensorInfo">
              <fieldset>
                <legend>${info.name}</legend>
                <label>Resolution</label>
                <select v-model="selection.selectedResolutions[info.name]">
                  <option v-for="res in info.resolutions">${res.w * res.h}</option>
                </select>

                <label>Frame rate</label>
                <select v-model="selection.selectedFpses[info.name]">
                  <option v-for="fps in info.fpses">${fps}</option>
                </select>

                <label>Availables streams:</label>
                <div v-for="stream in info.streams">
                  <input
                    type="checkbox"
                    v-model="selection.selectedStreams[stream.name+(stream.name === 'infrared' ? stream.index : '')]"
                  />
                  <label>${stream.name + (stream.name === 'infrared' ? stream.index : '')}</label>
                  <select
                    v-model="selection.selectedFormats[stream.name+(stream.name === 'infrared' ? stream.index : '')]"
                  >
                    <option v-for="format in stream.formats">${format}</option>
                  </select>
                </div>

                <label
                  >Controls
                  <input type="checkbox" v-model="controls.enabled[info.name]" />
                </label>

                <fieldset v-show="controls.enabled[info.name]">
                  <div v-if="controls.options[info.name] && controls.options[info.name].options">
                    <div v-for="option in controls.options[info.name].options">
                      <label>${option.option}: ${option.value}</label>
                      <input
                        type="range"
                        min="option.range.minValue"
                        max="option.range.maxValue"
                        step="option.range.step"
                        v-model="option.value"
                        @input=${e => this.onOptionChanged(info.name, option.option, option.value)}
                      />
                    </div>
                  </div>
                </fieldset>

                <span v-if="info.name.includes('Stereo')">
                  <button @click=${e => this.onstartStereo(e)}>Start ${info.name}</button>
                </span>

                <span v-if="info.name.includes('RGB')">
                  <button @click=${e => this.onstartColor(e)}>Start ${info.name}</button>
                </span>
              </fieldset>
            </div>
          </div>
          <div v-else><textarea>No sensor info!</textarea>></div>
        </fieldset>

        <span>
          <canvas
            id="color-canvas"
            width="canvasData.width['color']"
            height="canvasData.height['color']"
            v-show="canvasData.display['color']"
          ></canvas>
          <canvas
            id="depth-canvas"
            width="canvasData.width['depth']"
            height="canvasData.height['depth']"
            v-show="canvasData.display['depth']"
          ></canvas>
          <canvas
            id="infrared1-canvas"
            width="canvasData.width['infrared1']"
            height="canvasData.height['infrared1']"
            v-show="canvasData.display['infrared1']"
          ></canvas>
          <canvas
            id="infrared2-canvas"
            width="canvasData.width['infrared2']"
            height="canvasData.height['infrared2']"
            v-show="canvasData.display['infrared2']"
          ></canvas>
        </span>
      </div>
    `
  }

  onstartColor(e) {
    vue.canvasData.started.set(CommonNames.colorStreamName, true)
    let size = resolutionStringToNumberPair(vue.selection.selectedResolutions[CommonNames.colorSensorName])
    vue.canvasData.width[CommonNames.colorStreamName] = size.width
    vue.canvasData.height[CommonNames.colorStreamName] = size.height
    vue.canvasData.display[CommonNames.colorStreamName] = true
    updateCanvasConfig()
    proxy.startStreaming(CommonNames.colorSensorName, vue.selection)
    console.log('selected Resolutions:', vue.selection.selectedResolutions)
    console.log('selected Fpses:', vue.selection.selectedFpses)
    console.log('selected Streams:', vue.selection.selectedStreams)
    console.log('selected Formats:', vue.selection.selectedFormats)
    console.log('selected Preset:', vue.selection.selectedPreset)
  }

  onstartStereo(e) {
    let size = resolutionStringToNumberPair(vue.selection.selectedResolutions[CommonNames.stereoSensorName])
    let streams = [CommonNames.stereoStreamName, CommonNames.infraredStream1Name, CommonNames.infraredStream2Name]
    streams.forEach(stream => {
      if (vue.selection.selectedStreams[stream]) {
        vue.canvasData.started.set(stream, true)
        vue.canvasData.width[stream] = size.width
        vue.canvasData.height[stream] = size.height
        vue.canvasData.display[stream] = true
      }
    })

    updateCanvasConfig()
    initGL()
    proxy.startStreaming(CommonNames.stereoSensorName, vue.selection)
    console.log('selected Resolutions:', vue.selection.selectedResolutions)
    console.log('selected Fpses:', vue.selection.selectedFpses)
    console.log('selected Streams:', vue.selection.selectedStreams)
    console.log('selected Formats:', vue.selection.selectedFormats)
    console.log('selected Preset:', vue.selection.selectedPreset)
  }

  onOptionChanged(sensorName, optionName, value) {
    proxy.setOption(sensorName, optionName, value)
  }
}

customElements.define('realsense-setting', RealsenseSetting)
