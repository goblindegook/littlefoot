import { footnoteFromButton, footnoteFromPopover } from './footnotes'
import { createDocumentFootnotes } from './setup'
import { Settings } from '../settings'
import { Adapter, Footnote, TemplateData } from '../types'
import { CLASS_BUTTON, CLASS_FOOTNOTE, FOOTNOTE_ID } from './constants'

export type HTMLFootnote = {
  link: HTMLAnchorElement
  body: HTMLElement
  container: HTMLElement
  button: HTMLElement
  data: TemplateData
}

function findActiveFootnotes(selector = ''): Footnote[] {
  return Array.from(
    document.querySelectorAll<HTMLElement>(`${selector}.${CLASS_FOOTNOTE}`)
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
      const active = findActiveFootnotes()
      active.forEach(fn)
      return active
    },
    forOtherActiveFootnotes: (fn, footnote) => {
      const selector = `:not([${FOOTNOTE_ID}="${footnote.getId()}"])`
      const active = findActiveFootnotes(selector)
      active.forEach(fn)
      return active
    },
    hasHoveredFootnotes: () => {
      return !!document.querySelector(
        `.${CLASS_BUTTON}:hover, .${CLASS_FOOTNOTE}:hover`
      )
    }
  }
}
