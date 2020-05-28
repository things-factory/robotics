export default function route(page) {
  switch (page) {
    case 'handeye-calib':
      import('./pages/handeye-calib')
      return page
    case 'camera-calib':
      import('./pages/camera-calib')
      return page
  }
}
