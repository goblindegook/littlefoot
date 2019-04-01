import { createFootnote } from './footnotes'
import { createDocumentFootnotes } from './setup'
import { Settings } from '../settings'
import { Adapter, FootnoteAction, Footnote, TemplateData } from '../types'
import { CLASS_BUTTON, CLASS_FOOTNOTE, FOOTNOTE_ID } from './constants'
import { findSibling } from './dom'

export type HTMLFootnote = {
  link: HTMLAnchorElement
  body: HTMLElement
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

  // console.log(
  //   footnotes.map(({ data }) => `ID = ${data.id} REF = ${data.reference}`)
  // )

  return {
    findByElement: target => {
      const button = target.closest(`.${CLASS_BUTTON}`) as HTMLElement | null
      const popover = button && findSibling(button, `.${CLASS_FOOTNOTE}`)
      return button && createFootnote(button, popover)
    },
    findById: id => {
      const selector = `[${FOOTNOTE_ID}="${id}"].${CLASS_BUTTON}`
      const button = document.querySelector<HTMLElement>(selector)
      return button && createFootnote(button)
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
