import classList from 'dom-classlist'
import closest from 'dom-closest'
import siblings from 'dom-siblings'
import { maybeCall } from '../helpers'
import { findAll, findOne } from './document'
import {
  CLASS_ACTIVE,
  CLASS_BUTTON,
  CLASS_CHANGING,
  CLASS_HOVERED,
  FOOTNOTE_ID
} from './constants'

function createFootnote (button) {
  return button && {
    getButtonElement: () => button,

    blur: () => maybeCall(button, button.blur),

    activate: () => {
      button.setAttribute('aria-expanded', 'true')
      classList(button).add(CLASS_ACTIVE)
    },

    dismiss: () => {
      button.setAttribute('aria-expanded', 'false')
      classList(button).remove(CLASS_ACTIVE)
      classList(button).remove(CLASS_HOVERED)
    },

    getSelector: () => `[${FOOTNOTE_ID}="${button.getAttribute(FOOTNOTE_ID)}"]`,

    hover: () => classList(button).add(CLASS_HOVERED),

    isActive: () => classList(button).contains(CLASS_ACTIVE),

    isChanging: () => classList(button).contains(CLASS_CHANGING),

    startChanging: () => classList(button).add(CLASS_CHANGING),

    stopChanging: () => classList(button).remove(CLASS_CHANGING)
  }
}

export const findFootnote = selector => createFootnote(findOne(CLASS_BUTTON)(selector))

export const findAllFootnotes = selector => findAll(CLASS_BUTTON)(selector).map(createFootnote)

export function findClosestFootnote (button) {
  return createFootnote(closest(button, `.${CLASS_BUTTON}`))
}

export function getPopoverFootnote (popover) {
  return createFootnote(siblings(popover, `.${CLASS_BUTTON}`)[0])
}
