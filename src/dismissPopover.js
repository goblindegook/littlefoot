import addClass from './dom/addClass'
import hasClass from './dom/hasClass'
import removeClass from './dom/removeClass'

/**
 * Removes/adds appropriate classes to the footnote content and button after
 * a delay (to allow for transitions) it removes the actual footnote content.
 *
 * @param {DOMElement} footnote The footnote element to be removed.
 * @param {Number}     timeout  The delay between adding the removal classes and
 *                              actually removing the popover from the DOM.
 */
export default function dismissPopover(footnote, timeout) {
  const footnoteID   = footnote.getAttribute('data-footnote-id')
  const linkedButton = document.querySelector('.littlefoot-footnote__button[data-footnote-id="' + footnoteID + '"]')

  if (!hasClass(linkedButton, 'changing')) {
    addClass(linkedButton, 'changing')
    removeClass(linkedButton, 'is-active')
    removeClass(linkedButton, 'is-hover-instantiated')
    removeClass(linkedButton, 'is-click-instantiated')

    addClass(footnote, 'disapearing')
    removeClass(footnote, 'is-active')

    setTimeout(() => {
      footnote.parentNode.removeChild(footnote)
      removeClass(linkedButton, 'changing')
    }, timeout)
  }
}
