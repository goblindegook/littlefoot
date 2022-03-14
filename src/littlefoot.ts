import { DEFAULT_SETTINGS, Settings } from './settings'
import { createUseCases } from './use-cases'
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
  const useCases = createUseCases<HTMLElement>(setup(settings), settings)
  const removeListeners = addListeners(useCases)

  return {
    activate(id, delay = settings.activateDelay) {
      useCases.activate(id, delay)
    },

    dismiss(id, delay = settings.dismissDelay) {
      if (id === undefined) {
        useCases.dismissAll()
      } else {
        useCases.dismiss(id, delay)
      }
    },

    unmount() {
      removeListeners()
      useCases.unmount()
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
