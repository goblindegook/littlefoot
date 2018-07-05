import closest from 'dom-closest'
import { CLASS_BUTTON } from './constants'

/**
 * Get one or more elements for a selector.
 *
 * @param  {String}  selector      CSS selector of elements that are to be obtained.
 * @param  {Boolean} allowMultiple Allow selecting multiple elements.
 * @return {Array}                 All elements queried.
 */
function query (selector, allowMultiple) {
  return allowMultiple ? document.querySelectorAll(selector) : [document.querySelector(selector)]
}

/**
 * Get the closest footnote buttons or button for a selector.
 *
 * @param  {String}  selector      CSS selector of buttons that are to be obtained.
 * @param  {Boolean} allowMultiple Allow activating multiple buttons.
 * @return {Array}                 All footnotes activated by the function.
 */
export function getClosestFootnoteButtons (selector, allowMultiple = false) {
  return selector ? [...query(selector, allowMultiple)] : []
    .map(element => closest(element, `.${CLASS_BUTTON}`))
    .filter(button => button)
}
