import { createFootnote } from './footnote'
import { createDocumentFootnotes, restoreOriginalFootnotes } from './setup'
import { Adapter, Settings } from '../types'

export type RawFootnote = {
  readonly id: string
  readonly body: HTMLElement
  readonly button: HTMLElement
  readonly host: HTMLElement
  readonly content: string
  maxHeight: number
  isHovered: boolean
  // TODO: Return immutable, non-nullable popover element from setup instead of content:
  popover?: HTMLElement
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
    },
    unmount: () => {
      footnotes.forEach(footnote => footnote.unmount())
      restoreOriginalFootnotes()
    }
  }
}
