import { createFootnote } from './footnote'
import { createDocumentFootnotes } from './setup'
import { Adapter, TemplateData, Settings } from '../types'
import { FOOTNOTE_POPOVER, FOOTNOTE_BUTTON } from './constants'

export type RawFootnote = {
  link: HTMLAnchorElement
  body: HTMLElement
  container: HTMLElement
  button: HTMLElement
  popover?: HTMLElement
  data: TemplateData
}

export function createAdapter(settings: Settings): Adapter {
  const footnotes = createDocumentFootnotes(settings).map(createFootnote)

  return {
    findFootnote: id => {
      return footnotes.find(footnote => footnote.getId() === id) || null
    },
    forEachFootnote: callback => {
      footnotes.forEach(callback)
    },
    forEachFootnoteExcept: (callback, except) => {
      const exceptId = except.getId()
      footnotes
        .filter(footnote => footnote.getId() !== exceptId)
        .forEach(callback)
    },
    hasHoveredFootnotes: () => {
      return !!document.querySelector(
        `[${FOOTNOTE_BUTTON}]:hover, [${FOOTNOTE_POPOVER}]:hover`
      )
    }
  }
}
