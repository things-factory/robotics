import { VISION_OBJECT_TYPES } from '../../../controllers/vision-types'
import { Connections } from '@things-factory/integration-base'
import { config } from '@things-factory/env'
import spawn from 'await-spawn'

const visionConfig = config.get('vision', {})
const program = visionConfig.camera?.handEyeCalibrator?.program

export const calibrateHandeyeMatrixResolver = {
  async calibrateHandeyeMatrix(_: any, { name }, context: any) {
    var camera = Connections.getConnection(name)
    if (!camera || camera.discriminator !== VISION_OBJECT_TYPES.CAMERA) {
      throw Error(`Tracking Camera '${name}' Not Found`)
    }

    var executable = program[0]
    var params = [...program.slice(1), name]

    var calibrationMatrix = await spawn(executable, params)

    console.log('\n\n\n\n\n\n\n\ncalibration matrix', calibrationMatrix.toString(), executable, params)

    return JSON.parse(calibrationMatrix.toString())
  }
}
