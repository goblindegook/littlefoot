import { createSettings } from './settings'
import { createCore } from './core'
import { createDocumentAdapter } from './adapter'
import { bindEvents } from './events'

/**
 * Littlefoot instance factory.
 *
 * @param  {Object} options Littlefoot options.
 * @return {Object}         Littlefoot instance.
 */
const littlefoot = function (options) {
  const settings = createSettings(options)
  const adapter = createDocumentAdapter(settings)
  const core = createCore(adapter, settings)
  bindEvents(core)

  return {
    activate: core.activate,
    dismiss: core.dismiss,
    getSetting: key => settings[key],
    updateSetting: (key, value) => {
      settings[key] = value
    }
  }
}

export default littlefoot
