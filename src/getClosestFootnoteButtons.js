import closest from 'component-closest';

/**
 * Get the closest footnote buttons or button for a selector.
 *
 * @param  {String}  selector      CSS selector of buttons that are to be obtained.
 * @param  {Boolean} allowMultiple Allow activating multiple buttons.
 * @return {Array}                 All footnotes activated by the function.
 */
function getClosestFootnoteButtons(selector, allowMultiple = false) {
  const buttons = [];

  if (selector == null || selector.length === 0) {
    return buttons;
  }

  if (allowMultiple) {
    const elements = document.querySelectorAll(selector);
    Array.prototype.forEach.call(elements, (element) => {
      buttons.push(closest(element, '.littlefoot-footnote__button'));
    });

  } else {
    const element = document.querySelector(selector);
    buttons.push(closest(element, '.littlefoot-footnote__button'));
  }

  return buttons.filter((button) => button);
}

export default getClosestFootnoteButtons;
