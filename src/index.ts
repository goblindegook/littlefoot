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
    activate(id: string) {
      const footnote = core.get(id)
      if (footnote) {
        core.activate(footnote)
      }
    },

    dismiss(id, delay) {
      const footnote = id && core.get(id)
      if (footnote) {
        core.dismiss(footnote, delay)
      } else {
        adapter.forAllActiveFootnotes(fn => core.dismiss(fn, delay))
      }
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
