import classList from 'dom-classlist'
import {
  deactivateButton,
  isChanging,
  setChanging,
  unsetChanging,
  remove
} from './document'
import {
  CLASS_ACTIVE,
  CLASS_BUTTON,
  FOOTNOTE_ID
} from './constants'

function findButtonById (footnoteId) {
  return document.querySelector(`.${CLASS_BUTTON}[${FOOTNOTE_ID}="${footnoteId}"]`)
}

function deactivatePopover (popover) {
  classList(popover).remove(CLASS_ACTIVE)
}

/**
 * Returns a function that removes/adds appropriate classes to the footnote
 * content and button after a delay (to allow for transitions) it removes the
 * actual footnote content.
 *
 * @param  {Number}   timeout  The delay between adding the removal classes and
 *                             actually removing the popover from the DOM.
 * @return {Function}
 */
export function dismissPopover (timeout = 0) {
  return popover => {
    const footnoteId = popover.getAttribute(FOOTNOTE_ID)
    const button = findButtonById(footnoteId)

    if (!isChanging(button)) {
      setChanging(button)
      deactivateButton(button)
      deactivatePopover(popover)

      window.setTimeout(() => {
        remove(popover)
        unsetChanging(button)
      }, timeout)
    }
  }
}
