/*
  var shader = new RealsenseInfraredStream(canvas)
  shader.setTextureSize(1024, 768)
  shader.draw(data)
*/

export class RealsenseInfraredStream {
  canvas
  gl
  shaders
  buffers
  texture

  constructor(canvas) {
    this.canvas = canvas

    this.gl = this.canvas.getContext('webgl')

    this.texture = this.gl.createTexture()
    this.shaders = RealsenseInfraredStream.initShaders(this.gl)
    this.buffers = RealsenseInfraredStream.initBuffers(this.gl)
  }

  configure(setting) {
    var { width, height } = setting
    this.textureWidth = width
    this.textureHeight = height
  }

  stream(data) {
    let fileReader = new FileReader()
    fileReader.onload = event => {
      const arrayBuffer = event.target.result
      this.renderGL(arrayBuffer)
    }

    /* data must be Blob */
    fileReader.readAsArrayBuffer(data)
  }

  renderGL(arrayBuffer) {
    const gl = this.gl
    const texture = this.texture

    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.LUMINANCE,
      this.textureWidth,
      this.textureHeight,
      0,
      gl.LUMINANCE,
      gl.UNSIGNED_BYTE,
      new Uint8Array(arrayBuffer)
    )
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

    /* draw into canvas */
    const { width, height } = this.canvas

    gl.viewport(0, 0, width, height)

    const num = 2 // every coordinate composed of 2 values
    const type = gl.FLOAT
    const normalize = false // don't normalize
    const stride = 0 // how many bytes to get from one set to the next
    const offset = 0 // how many bytes inside the buffer to start from

    /* vertex positions */
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.position)
    gl.vertexAttribPointer(this.shaders.attributeLocations.vertexPosition, num, type, normalize, stride, offset)
    gl.enableVertexAttribArray(this.shaders.attributeLocations.vertexPosition)

    /* texture-coords */
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.textureCoord)
    gl.vertexAttribPointer(this.shaders.attributeLocations.textureCoord, num, type, normalize, stride, offset)
    gl.enableVertexAttribArray(this.shaders.attributeLocations.textureCoord)

    gl.useProgram(this.shaders.program)
    // Tell WebGL we want to affect texture unit 0
    gl.activeTexture(gl.TEXTURE0)
    // Tell the shader we bound the texture to texture unit 0
    gl.uniform1i(this.shaders.uniformLocations.uSampler, 0)

    const vertexCount = 4

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.position)
    gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount)
  }

  static initBuffers(gl) {
    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

    const positions = [-1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0]
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

    const textureCoordBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer)

    const textureCoordinates = [
      // Front
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      1.0,
      1.0
    ]

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW)

    return {
      position: positionBuffer,
      textureCoord: textureCoordBuffer
    }
  }

  static initShaders(gl) {
    const vsSource = `
        attribute vec4 aVertexPosition;
        attribute vec2 aTextureCoord;
        varying highp vec2 vTextureCoord;
    
        void main(void) {
          gl_Position = aVertexPosition;
          vTextureCoord = aTextureCoord;
        }
      `
    const fsSource = `
        varying highp vec2 vTextureCoord;
        uniform sampler2D uSampler;
    
        void main(void) {
          gl_FragColor = texture2D(uSampler, vTextureCoord);
        }
      `
    const vs = gl.createShader(gl.VERTEX_SHADER)
    const fs = gl.createShader(gl.FRAGMENT_SHADER)
    gl.shaderSource(vs, vsSource)
    gl.shaderSource(fs, fsSource)
    gl.compileShader(vs)
    gl.compileShader(fs)

    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
      alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(vs))
      gl.deleteShader(vs)
      return null
    }
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
      alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(fs))
      gl.deleteShader(fs)
      return null
    }

    const shaderProgram = gl.createProgram()
    gl.attachShader(shaderProgram, vs)
    gl.attachShader(shaderProgram, fs)
    gl.linkProgram(shaderProgram)

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram))
      return null
    }

    return {
      program: shaderProgram,
      attributeLocations: {
        vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
        textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord')
      },
      uniformLocations: {
        uSampler: gl.getUniformLocation(shaderProgram, 'uSampler')
      }
    }
  }
}
