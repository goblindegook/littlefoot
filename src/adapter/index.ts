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

function find(className: string, selector = ''): HTMLElement[] {
  return Array.from(
    document.querySelectorAll<HTMLElement>(`${selector}.${className}`)
  )
}

function forAllActiveFootnotes(fn: FootnoteAction, selector = ''): Footnote[] {
  return find(CLASS_FOOTNOTE, selector).map(popover => {
    const button = findSibling(popover, `.${CLASS_BUTTON}`)!
    const footnote = createFootnote(button, popover)
    fn(footnote)
    return footnote
  })
}

function forOtherActiveFootnotes(
  fn: FootnoteAction,
  footnote: Footnote
): Footnote[] {
  const selector = `:not([${FOOTNOTE_ID}="${footnote.getId()}"])`
  return forAllActiveFootnotes(fn, selector)
}

function hasHoveredFootnotes(): boolean {
  return !!document.querySelector(
    `.${CLASS_BUTTON}:hover, .${CLASS_FOOTNOTE}:hover`
  )
}

function findByElement(target: HTMLElement): Footnote | undefined {
  const button = target.closest(`.${CLASS_BUTTON}`) as HTMLElement | null
  const popover = button && findSibling(button, `.${CLASS_FOOTNOTE}`)
  return button ? createFootnote(button, popover) : undefined
}

function findBySelector(selector: string): Footnote[] {
  return find(CLASS_BUTTON, selector).map(button => createFootnote(button))
}

export function createAdapter(settings: Settings): Adapter {
  const footnotes = createDocumentFootnotes(settings)

  // console.log(
  //   footnotes.map(({ data }) => `ID = ${data.id} REF = ${data.reference}`)
  // )

  return {
    findByElement,
    findBySelector,
    forAllActiveFootnotes,
    forOtherActiveFootnotes,
    hasHoveredFootnotes
  }
}
