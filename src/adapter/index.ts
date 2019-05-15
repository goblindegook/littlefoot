import { createFootnote } from './footnote'
import { createDocumentFootnotes } from './setup'
import { Adapter, TemplateData, Settings } from '../types'
import { CLASS_PRINT_ONLY } from './constants'

export type RawFootnote = {
  readonly reference: HTMLElement
  readonly body: HTMLElement
  readonly button: HTMLElement
  readonly host: HTMLElement
  maxHeight: number
  isHovered: boolean
  popover?: HTMLElement
  readonly data: TemplateData
}

export function createAdapter(settings: Settings): Adapter {
  const rawFootnotes = createDocumentFootnotes(settings)
  const footnotes = rawFootnotes.map(createFootnote)

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
      rawFootnotes.forEach(({ host }) => {
        host.parentElement!.removeChild(host)
      })

      Array.from(document.querySelectorAll(`.${CLASS_PRINT_ONLY}`)).forEach(
        element => element.classList.remove(CLASS_PRINT_ONLY)
      )
    }
  }
}
