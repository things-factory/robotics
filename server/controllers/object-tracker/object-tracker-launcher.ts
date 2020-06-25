import { spawnSync } from 'child_process'
import { spawn } from 'child_process'
import Path from 'path'
import OS from 'os'

import { config } from '@things-factory/env'

const { accessSync, F_OK } = require('fs')

const visionConfig = config.get('vision', {})
const executable = visionConfig.objectTracker.path

/*!
 * @class ObjectTrackerLauncher
 * @brief Class that encapsulates "object-tracker" executable.
 */
export class ObjectTrackerLauncher {
  /*!
   * @fn spawnPipeline
   * @brief spawns a GStreamer pipeline using object-tracker
   * @return A Node <child-process> of the launched pipeline
   * @see To construct a correct pipeline arg, consult the link below:
   * https://gstreamer.freedesktop.org/data/doc/gstreamer/head/manual/html/chapter-programs.html
   * @usage spawnPipeline('videotestsrc ! autovideosink')
   */
  static spawnPipeline(pipeline) {
    return spawn(executable, pipeline.split(' '))
  }
}
