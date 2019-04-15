import { Settings } from './types'
import { createCore } from './core'
import { createAdapter } from './adapter'
import { bindEvents } from './adapter/events'
import {
  CLASS_CONTENT,
  CLASS_TOOLTIP,
  CLASS_WRAPPER,
  FOOTNOTE_POPOVER_ID,
  FOOTNOTE_BUTTON_ID
} from './adapter/constants'

type Littlefoot = Readonly<{
  activate: (id: string) => void
  dismiss: (id?: string, delay?: number) => void
  getSetting: <K extends keyof Settings>(key: K) => Settings[K]
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void
}>

const DEFAULT_SETTINGS: Settings = {
  activateDelay: 100,
  activateOnHover: false,
  allowDuplicates: true,
  allowMultiple: false,
  anchorParentSelector: 'sup',
  anchorPattern: /(fn|footnote|note)[:\-_\d]/gi,
  dismissDelay: 100,
  dismissOnUnhover: false,
  footnoteParentClass: 'footnote',
  footnoteSelector: 'li',
  hoverDelay: 250,
  contentTemplate: `<aside class="littlefoot-footnote is-positioned-bottom" id="fncontent:<%= id %>" ${FOOTNOTE_POPOVER_ID}="<%= id %>" alt="Footnote <%= number %>"><div class="${CLASS_WRAPPER}"><div class="${CLASS_CONTENT}" tabindex="0"><%= content %></div></div><div class="${CLASS_TOOLTIP}"></div></aside>`,
  buttonTemplate: `<span class="littlefoot-footnote__container"><button class="littlefoot-footnote__button littlefoot-footnote__button__ellipsis" id="<%= reference %>" ${FOOTNOTE_BUTTON_ID}="<%= id %>" data-footnote-number="<%= number %>" title="See Footnote <%= number %>" aria-controls="fncontent:<%= id %>" aria-expanded="false" aria-label="Footnote <%= number %>" rel="footnote"><svg viewbox="0 0 31 6" preserveAspectRatio="xMidYMid"><circle r="3" cx="3" cy="3" fill="white"></circle><circle r="3" cx="15" cy="3" fill="white"></circle><circle r="3" cx="27" cy="3" fill="white"></circle></svg></button></span>`
}

export function littlefoot(userSettings: Partial<Settings> = {}): Littlefoot {
  const settings = { ...DEFAULT_SETTINGS, ...userSettings }
  const adapter = createAdapter(settings)
  const core = createCore(adapter, settings)
  bindEvents(core)

  return {
    activate(id) {
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
        core.dismissAll(delay)
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
