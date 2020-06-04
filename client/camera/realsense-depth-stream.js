export class RealsenseDepthStream {
  constructor(canvas) {
    this.canvas = canvas
    this.context = this.canvas.getContext('2d')
  }

  configure(setting) {
    this.setting = setting

    var { format, width, height, index, stream } = setting

    this.canvas.width = width
    this.canvas.height = height
  }

  stream(data) {
    var blob = new Blob([data], { type: 'image/jpg' })
    var url = URL.createObjectURL(blob)

    var image = new Image()
    image.src = url
    image.onload = () => {
      this.context.drawImage(image, 0, 0)
      URL.revokeObjectURL(url)
    }
  }
}
