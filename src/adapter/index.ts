import { createFootnote } from './footnote'
import { createDocumentFootnotes, restoreOriginalFootnotes } from './setup'
import { Settings } from '../types'
import { Adapter } from '../core'

export interface RawFootnote {
  readonly id: string
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
    footnotes: () => footnotes,
    unmount: () => {
      footnotes.forEach(footnote => footnote.unmount())
      restoreOriginalFootnotes()
    }
  }
}
