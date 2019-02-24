import { createSettings, Settings } from './settings'
import { createCore } from './core'
import { createAdapter } from './adapter'
import { bindEvents } from './adapter/events'
import { isNotNull } from './isNotNull'

type Littlefoot = {
  activate: (selector: string, className?: string) => void
  dismiss: (selector?: string, delay?: number) => void
  getSetting: <K extends keyof Settings>(key: K) => Settings[K]
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void
}

export function littlefoot(options: Partial<Settings> = {}): Littlefoot {
  const settings = createSettings(options)
  const adapter = createAdapter(settings)
  const core = createCore(adapter, settings)
  bindEvents(core)

  return {
    activate(selector, className) {
      const { allowMultiple } = settings
      if (selector) {
        const footnotes = allowMultiple
          ? adapter.findAllFootnotes(selector)
          : [adapter.findFootnote(selector)]

        footnotes
          .filter(isNotNull)
          .forEach(footnote => core.activate(footnote, className))
      }
    },

    dismiss(selector, delay) {
      adapter.forAllActiveFootnotes(
        footnote => core.dismiss(footnote, delay),
        selector
      )
    },

    getSetting(key) {
      return settings[key]
    },

    updateSetting(key, value) {
      settings[key] = value
    }
  }
}

export default littlefoot
