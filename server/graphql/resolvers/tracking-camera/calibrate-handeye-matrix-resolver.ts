import { ROBOTICS_OBJECT_TYPES } from '../../../controllers/robotics-types'
import { Connections } from '@things-factory/integration-base'
import { config } from '@things-factory/env'
import spawn from 'await-spawn'

const visionConfig = config.get('vision', {})
const program = visionConfig.camera?.handEyeCalibrator?.program

export const calibrateHandeyeMatrixResolver = {
  async calibrateHandeyeMatrix(_: any, { name }, context: any) {
    var camera = Connections.getConnection(name)
    if (!camera || camera.discriminator !== ROBOTICS_OBJECT_TYPES.CAMERA) {
      throw Error(`Tracking Camera '${name}' Not Found`)
    }

    var executable = program[0]
    var params = [...program.slice(1), name]

    var calibrationMatrix = await spawn(executable, params)

    return JSON.parse(calibrationMatrix.toString())
  }
}
