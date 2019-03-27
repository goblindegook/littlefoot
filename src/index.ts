import { createSettings, Settings } from './settings'
import { createCore } from './core'
import { createAdapter } from './adapter'
import { bindEvents } from './adapter/events'

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
  bindEvents(adapter, core)

  return {
    activate(selector = '') {
      adapter
        .findBySelector(selector)
        .filter((_, idx) => settings.allowMultiple || idx === 0)
        .forEach(footnote => core.activate(footnote))
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
