import {
  forAllActiveFootnotes,
  findAll,
  createFootnote,
  findOne
} from './footnotes'
import { setupDocument } from './setup'
import { Settings } from '../settings'
import { Adapter, FootnoteAction, Footnote } from '../types'
import { CLASS_BUTTON, CLASS_FOOTNOTE, FOOTNOTE_ID } from './constants'

function findFootnote(selector: string): Footnote | null {
  const button = findOne(CLASS_BUTTON, selector)
  return button && createFootnote(button)
}

function findAllFootnotes(selector: string): Footnote[] {
  return findAll(CLASS_BUTTON, selector).map(button => createFootnote(button))
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
