import { spawnSync } from 'child_process'
import { spawn } from 'child_process'
import Path from 'path'
import OS from 'os'

const { accessSync, F_OK } = require('fs')

const gst_launch_executable = 'gst-launch-1.0'
const gst_launch_versionarg = '--version'

/*!
 * @class GstLaunch
 * @brief Class that encapsulates "gst-launch" executable.
 */
export class GstLaunch {
  /*!
   * @fn getPath
   * @brief Returns path to gst-launch or undefined on error
   */
  static getPath() {
    var detected_path = undefined

    if (OS.platform() == 'win32') {
      // On Windows, GStreamer MSI installer defines the following
      // environment variables.
      const detected_path_x64 = process.env.GSTREAMER_1_0_ROOT_X86_64
      const detected_path_x32 = process.env.GSTREAMER_1_0_ROOT_X86
      if (detected_path_x64 || detected_path_x32) {
        // If both variables are present, favor the architecture
        // of GStreamer which is the same as Node.js runtime.
        if (detected_path_x64 && detected_path_x32) {
          if (process.arch == 'x64') detected_path = detected_path_x64
          else if (process.arch == 'x32') detected_path = detected_path_x32
        } else {
          detected_path = detected_path_x64 || detected_path_x32
        }
      }

      if (detected_path) {
        detected_path = Path.join(detected_path, 'bin', gst_launch_executable + '.exe')
        try {
          accessSync(detected_path, F_OK)
        } catch (e) {
          detected_path = undefined
        }
      } else {
        // Look for GStreamer on PATH
        var path_dirs = process.env.PATH.split(';')
        for (var index = 0; index < path_dirs.length; ++index) {
          try {
            var base = Path.normalize(path_dirs[index])
            var bin = Path.join(base, gst_launch_executable + '.exe')
            accessSync(bin, F_OK)
            detected_path = bin
          } catch (e) {
            /* no-op */
          }
        }
      }
    } else {
      // Look for GStreamer on PATH
      var path_dirs = process.env.PATH.split(':')
      for (var index = 0; index < path_dirs.length; ++index) {
        try {
          var base = Path.normalize(path_dirs[index])
          var bin = Path.join(base, gst_launch_executable)
          accessSync(bin, F_OK)
          detected_path = bin
        } catch (e) {
          /* no-op */
        }
      }
    }

    return detected_path
  }

  /*!
   * @fn getVersion
   * @brief Returns version string of GStreamer on this machine by
   * invoking the gst-launch executable or 'undefined' on failure.
   */
  static getVersion() {
    var version_str = undefined
    try {
      var gst_launch_path = GstLaunch.getPath()

      var output = spawnSync(gst_launch_path, [gst_launch_versionarg], { timeout: 1000 }).stdout

      if (output && output.toString().includes('GStreamer')) {
        version_str = output
          .toString()
          .match(/GStreamer\s+.+/g)[0]
          .replace(/GStreamer\s+/, '')
      }
    } catch (ex) {
      version_str = undefined
    }

    return version_str
  }

  /*!
   * @fn isAvailable
   * @brief Answers true if gst-launch executable is available
   */
  static isAvailable() {
    return GstLaunch.getVersion() != undefined
  }

  /*!
   * @fn spawnPipeline
   * @brief spawns a GStreamer pipeline using gst-launch
   * @return A Node <child-process> of the launched pipeline
   * @see To construct a correct pipeline arg, consult the link below:
   * https://gstreamer.freedesktop.org/data/doc/gstreamer/head/manual/html/chapter-programs.html
   * @usage spawnPipeline('videotestsrc ! autovideosink')
   */
  static spawnPipeline(pipeline) {
    // Assert.ok(isAvailable(), 'gst-launch is not available.')

    var gst_launch_path = GstLaunch.getPath()

    return spawn(gst_launch_path, pipeline.split(' '))
  }
}
