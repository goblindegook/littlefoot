import { createSettings, LittlefootSettings } from './settings'
import { createCore } from './core'
import { createDocumentAdapter } from './adapter'
import { bindEvents } from './adapter/events'

/**
 * Littlefoot instance factory.
 *
 * @param  {Object} options Littlefoot options.
 * @return {Object}         Littlefoot instance.
 */
export const littlefoot = function (options: Partial<LittlefootSettings> = {}) {
  const settings = createSettings(options)
  const adapter = createDocumentAdapter(settings) as any
  const core = createCore(adapter, settings)
  bindEvents(core)

  return {
    activate (selector, className) {
      const { allowMultiple } = settings
      if (selector) {
        const footnotes = allowMultiple
          ? adapter.findAllFootnotes(selector)
          : [adapter.findFootnote(selector)]

        return footnotes
          .filter(footnote => footnote)
          .map(footnote => core.activate(footnote, className))
      }
    },

    dismiss (selector, delay) {
      adapter.forAllActiveFootnotes(
        footnote => core.dismiss(footnote, delay),
        selector
      )
    },

    getSetting (key) {
      return settings[key]
    },

    updateSetting (key, value) {
      settings[key] = value
    }
  }
}

export default littlefoot
