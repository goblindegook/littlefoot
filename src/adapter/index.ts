import { createFootnote } from './footnote'
import { createDocumentFootnotes } from './setup'
import { Adapter, TemplateData, Settings } from '../types'
import { FOOTNOTE_BUTTON_ID, FOOTNOTE_POPOVER_ID } from './constants'

export type RawFootnote = {
  readonly link: HTMLAnchorElement
  readonly body: HTMLElement
  readonly button: HTMLElement
  popover?: HTMLElement
  readonly data: TemplateData
}

export function createAdapter(settings: Settings): Adapter {
  const footnotes = createDocumentFootnotes(settings).map(createFootnote)

  return {
    findFootnote: id => {
      return footnotes.find(footnote => footnote.getId() === id)
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
        `[${FOOTNOTE_BUTTON_ID}]:hover, [${FOOTNOTE_POPOVER_ID}]:hover`
      )
    }
  }
}
