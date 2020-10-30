import { DEFAULT_SETTINGS, Settings } from './settings'
import { createCore } from './core'
import { setup } from './dom/document'
import { addListeners } from './dom/events'

type Littlefoot = Readonly<{
  activate: (id: string, delay?: number) => void
  dismiss: (id?: string, delay?: number) => void
  unmount: () => void
  getSetting: <K extends keyof Settings>(key: K) => Settings[K]
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void
}>

export function littlefoot(userSettings: Partial<Settings> = {}): Littlefoot {
  const settings = { ...DEFAULT_SETTINGS, ...userSettings }
  const core = createCore<HTMLElement>(setup(settings), settings)
  const removeListeners = addListeners(core)

  return {
    activate(id, delay = settings.activateDelay) {
      core.activate(id, delay)
    },

    dismiss(id, delay = settings.dismissDelay) {
      if (id === undefined) {
        core.dismissAll()
      } else {
        core.dismiss(id, delay)
      }
    },

    unmount() {
      removeListeners()
      core.unmount()
    },

    getSetting(key) {
      return settings[key]
    },

    updateSetting(key, value) {
      settings[key] = value
    },
  }
}

export default littlefoot
