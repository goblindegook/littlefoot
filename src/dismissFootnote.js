import classList from 'dom-classlist'
import {
  CLASS_ACTIVE,
  CLASS_CHANGING,
  CLASS_HOVERED,
  CLASS_BUTTON,
  FOOTNOTE_ID
} from './constants'

/**
 * Returns a function that removes/adds appropriate classes to the footnote
 * content and button after a delay (to allow for transitions) it removes the
 * actual footnote content.
 *
 * @param  {Number}     timeout  The delay between adding the removal classes and
 *                               actually removing the popover from the DOM.
 * @return {Function}
 */
export function dismissFootnote (timeout = 0) {
  return footnote => {
    const footnoteID = footnote.getAttribute(FOOTNOTE_ID)
    const linkedButton = document.querySelector(`.${CLASS_BUTTON}[${FOOTNOTE_ID}="${footnoteID}"]`)

    if (!classList(linkedButton).contains(CLASS_CHANGING)) {
      linkedButton.setAttribute('aria-expanded', 'false')

      classList(linkedButton).add(CLASS_CHANGING)
      classList(linkedButton).remove(CLASS_ACTIVE)
      classList(linkedButton).remove(CLASS_HOVERED)
      classList(footnote).remove(CLASS_ACTIVE)

      window.setTimeout(() => {
        footnote.parentNode.removeChild(footnote)
        classList(linkedButton).remove(CLASS_CHANGING)
      }, timeout)
    }
  }
}
