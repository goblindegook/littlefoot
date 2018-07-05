import closest from 'dom-closest'

/**
 * Get the closest footnote buttons or button for a selector.
 *
 * @param  {String}  selector      CSS selector of buttons that are to be obtained.
 * @param  {Boolean} allowMultiple Allow activating multiple buttons.
 * @return {Array}                 All footnotes activated by the function.
 */
function getClosestFootnoteButtons (selector, allowMultiple = false) {
  if (selector) {
    const elements = allowMultiple ? document.querySelectorAll(selector) : [document.querySelector(selector)]

    return [...elements]
      .map((element) => closest(element, '.littlefoot-footnote__button'))
      .filter((button) => button)
  } else {
    return []
  }
}

export default getClosestFootnoteButtons
