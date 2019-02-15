import {
  findAllFootnotes,
  findFootnote,
  forAllActiveFootnotes,
  forOtherActiveFootnotes,
  hasHoveredFootnotes
} from './footnotes'
import { setupDocument } from './setup'
import { Settings } from '../settings'
import { Adapter } from '../types'

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
