import { CLASS_BUTTON } from './constants'
import { findClosestButton } from './document'

function findButtons (selector, multiple) {
  return selector
    ? multiple
      ? [...document.querySelectorAll(`${selector}.${CLASS_BUTTON}`)]
      : [document.querySelector(`${selector}.${CLASS_BUTTON}`)]
    : []
}

/**
 * Get the closest footnote buttons or button for a selector.
 *
 * @param  {String}  selector CSS selector of buttons that are to be obtained.
 * @param  {Boolean} multiple Allow activating multiple buttons.
 * @return {Array}            All footnotes activated by the function.
 */
export function getClosestFootnoteButtons (selector, multiple = false) {
  return findButtons(selector, multiple)
    .map(findClosestButton)
    .filter(button => button)
}
