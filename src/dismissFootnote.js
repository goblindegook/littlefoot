import classList from 'dom-classlist'

/**
 * Removes/adds appropriate classes to the footnote content and button after
 * a delay (to allow for transitions) it removes the actual footnote content.
 *
 * @param {DOMElement} footnote The footnote element to be removed.
 * @param {Number}     timeout  The delay between adding the removal classes and
 *                              actually removing the popover from the DOM.
 */
export default function dismissFootnote(footnote, timeout) {
  const footnoteID   = footnote.getAttribute('data-footnote-id')
  const linkedButton = document.querySelector('.littlefoot-footnote__button[data-footnote-id="' + footnoteID + '"]')

  if (classList(linkedButton).contains('changing')) {
    return
  }

  classList(linkedButton).add('changing')
  classList(linkedButton).remove('is-active')
  classList(linkedButton).remove('is-hover-instantiated')
  classList(linkedButton).remove('is-click-instantiated')

  classList(footnote).add('disapearing')
  classList(footnote).remove('is-active')

  window.setTimeout(() => {
    footnote.parentNode.removeChild(footnote)
    classList(linkedButton).remove('changing')
  }, timeout)
}
