export class RealsenseColorStream {
  constructor(canvas) {
    this.canvas = canvas
    this.context = this.canvas.getContext('2d')
  }

  configure(setting) {
    this.setting = setting
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
