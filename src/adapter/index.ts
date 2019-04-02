import { footnoteFromButton, footnoteFromPopover } from './footnotes'
import { createDocumentFootnotes } from './setup'
import { Settings } from '../settings'
import { Adapter, Footnote, TemplateData } from '../types'
import { FOOTNOTE_ID, FOOTNOTE_POPOVER, FOOTNOTE_BUTTON } from './constants'

export type HTMLFootnote = {
  link: HTMLAnchorElement
  body: HTMLElement
  container: HTMLElement
  button: HTMLElement
  data: TemplateData
}

function findActiveFootnotes(selector = ''): Footnote[] {
  return Array.from(
    document.querySelectorAll<HTMLElement>(`${selector}[${FOOTNOTE_POPOVER}]`)
  ).map(footnoteFromPopover)
}

export function createAdapter(settings: Settings): Adapter {
  const footnotes = createDocumentFootnotes(settings)

  return {
    findById: id => {
      const footnote = footnotes.find(({ data }) => data.id === id) || null
      return footnote && footnoteFromButton(footnote.button)
    },
    forAllActiveFootnotes: fn => {
      findActiveFootnotes().forEach(fn)
    },
    forOtherActiveFootnotes: (fn, footnote) => {
      const selector = `:not([${FOOTNOTE_ID}="${footnote.getId()}"])`
      findActiveFootnotes(selector).forEach(fn)
    },
    hasHoveredFootnotes: () => {
      return !!document.querySelector(
        `[${FOOTNOTE_BUTTON}]:hover, [${FOOTNOTE_POPOVER}]:hover`
      )
    }
  }
}
