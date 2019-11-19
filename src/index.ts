import { Settings, DEFAULT_SETTINGS } from './settings'
import { createCore } from './core'
import { setup, cleanup } from './dom'
import { addListeners } from './dom/events'

type Littlefoot = Readonly<{
  activate: (id: string) => void
  dismiss: (id?: string, delay?: number) => void
  unmount: () => void
  getSetting: <K extends keyof Settings>(key: K) => Settings[K]
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void
}>

export function littlefoot(userSettings: Partial<Settings> = {}): Littlefoot {
  const settings = { ...DEFAULT_SETTINGS, ...userSettings }
  const { lookup, activate, dismiss, dismissAll, unmount } = createCore(
    { setup, addListeners, cleanup },
    settings
  )

  return {
    activate(id) {
      const footnote = lookup(id)
      if (footnote) {
        activate(footnote, settings.activateDelay, settings.activateCallback)
      }
    },

    dismiss(id, delay = settings.dismissDelay) {
      const footnote = id && lookup(id)
      if (footnote) {
        dismiss(footnote, delay)
      } else {
        dismissAll()
      }
    },

    unmount,

    getSetting(key) {
      return settings[key]
    },

    updateSetting(key, value) {
      settings[key] = value
    }
  }
}

export default littlefoot
