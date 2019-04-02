import { createFootnote } from './footnotes'
import { createDocumentFootnotes } from './setup'
import { Settings } from '../settings'
import { Adapter, Footnote, TemplateData } from '../types'
import { CLASS_BUTTON, CLASS_FOOTNOTE, FOOTNOTE_ID } from './constants'
import { findSibling } from './dom'

export type HTMLFootnote = {
  link: HTMLAnchorElement
  body: HTMLElement
  container: HTMLElement
  button: HTMLElement
  data: TemplateData
}

function findActiveFootnotes(selector = ''): Footnote[] {
  const popovers = document.querySelectorAll<HTMLElement>(
    `${selector}.${CLASS_FOOTNOTE}`
  )
  return Array.from(popovers).map(popover => {
    const button = findSibling(popover, `.${CLASS_BUTTON}`)!
    const footnote = createFootnote(button, popover)
    return footnote
  })
}

export function createAdapter(settings: Settings): Adapter {
  const footnotes = createDocumentFootnotes(settings)

  return {
    findById: id => {
      const footnote = footnotes.find(({ data }) => `${data.id}` === id)
      return footnote
        ? createFootnote(
            footnote.button,
            findSibling(footnote.button, `.${CLASS_FOOTNOTE}`)
          )
        : null
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
