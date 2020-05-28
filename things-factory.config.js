import route from './client/route'
import bootstrap from './client/bootstrap'

export default {
  route,
  routes: [
    {
      tagname: 'camera-calib',
      page: 'camera-calib'
    },
    {
      tagname: 'handeye-calib',
      page: 'handeye-calib'
    }
  ],
  bootstrap
}
