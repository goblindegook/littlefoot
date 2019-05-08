import { createFootnote } from './footnote'
import { createDocumentFootnotes } from './setup'
import { Adapter, TemplateData, Settings } from '../types'

export type RawFootnote = {
  readonly reference: HTMLElement
  readonly body: HTMLElement
  readonly button: HTMLElement
  maxHeight: number
  isHovered: boolean
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
      return footnotes.some(footnote => footnote.isHovered())
    }
  }
}
