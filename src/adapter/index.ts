import { createFootnote } from './footnotes'
import { setupDocument } from './setup'
import { Settings } from '../settings'
import { Adapter, FootnoteAction, Footnote } from '../types'
import { CLASS_BUTTON, CLASS_FOOTNOTE, FOOTNOTE_ID } from './constants'
import { findSibling } from './dom'

function findOne(className: string, selector = ''): HTMLElement | null {
  return document.querySelector<HTMLElement>(`${selector}.${className}`)
}

function findFootnote(selector: string): Footnote | null {
  const button = findOne(CLASS_BUTTON, selector)
  return button && createFootnote(button)
}

function findAllFootnotes(selector: string): Footnote[] {
  return findAll(CLASS_BUTTON, selector).map(button => createFootnote(button))
}

export function findAll(className: string, selector = ''): HTMLElement[] {
  return Array.from(
    document.querySelectorAll<HTMLElement>(`${selector}.${className}`)
  )
}

export function forAllActiveFootnotes(
  fn: FootnoteAction,
  selector = ''
): Footnote[] {
  return findAll(CLASS_FOOTNOTE, selector).map(popover => {
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
  return forAllActiveFootnotes(
    fn,
    `:not([${FOOTNOTE_ID}="${footnote.getId()}"])`
  )
}

function hasHoveredFootnotes(): boolean {
  return !!document.querySelector(
    `.${CLASS_BUTTON}:hover, .${CLASS_FOOTNOTE}:hover`
  )
}

export function createAdapter(settings: Settings): Adapter {
  setupDocument(settings)

  return {
    findAllFootnotes,
    findFootnote,
    forAllActiveFootnotes,
    forOtherActiveFootnotes,
    hasHoveredFootnotes
  }
}
