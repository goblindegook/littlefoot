/**
 * Positions the tooltip at the same relative horizontal position as the button.
 *
 * @param  {DOMElement} popover      Popover element.
 * @param  {Number}     leftRelative Relative positioning to the left.
 */
export default function positionTooltip(popover, leftRelative) {
  const tooltip = popover.querySelector('.littlefoot-footnote__tooltip')

  if (tooltip) {
    leftRelative = leftRelative != null ? leftRelative : 0.5
    tooltip.style.left = (leftRelative * 100) + '%'
  }
}
