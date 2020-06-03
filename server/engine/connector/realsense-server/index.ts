import rs2 from '@things-factory/node-librealsense2'

const port = 3000
const wsPort = 3100

import { ConnectionManager } from './connection-manager'
import { Realsense } from './realsense'

let connectMgr = new ConnectionManager(port, wsPort)
let rsObj = new Realsense(connectMgr)
rsObj.init()
connectMgr.start()
