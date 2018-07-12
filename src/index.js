import { createSettings } from './settings'
import { createCore } from './core'
import { createDocumentAdapter } from './adapter'
import { bindEvents } from './adapter/events'

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
    activate (selector, className) {
      if (selector) {
        const { allowMultiple } = settings
        const footnotes = allowMultiple
          ? adapter.findAllFootnotes(selector)
          : [adapter.findFootnote(selector)]

        footnotes
          .filter(footnote => footnote)
          .map(footnote => core.activate(footnote, className))
      }
    },

    dismiss: core.dismiss,

    getSetting (key) {
      return settings[key]
    },

    updateSetting (key, value) {
      settings[key] = value
    }
  }
}

export default littlefoot
