import { createDocumentFootnotes, restoreOriginalFootnotes } from './setup'
import { Settings } from '../types'
import { Adapter } from '../core'

export function createAdapter(settings: Settings): Adapter {
  const footnotes = createDocumentFootnotes(settings)

  return {
    footnotes: () => footnotes,
    unmount: () => {
      footnotes.forEach(footnote => footnote.unmount())
      restoreOriginalFootnotes()
    }
  }
}
