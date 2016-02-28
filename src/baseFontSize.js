/**
 * Calculates the base font size for `em`- and `rem`-based sizing.
 *
 * @return {Number} The base font size in pixels.
 */
export default function baseFontSize() {
  const element = document.createElement('div')

  element.style.cssText = 'display:inline-block;padding:0;line-height:1;position:absolute;visibility:hidden;font-size:1em;'
  element.appendChild(document.createElement('M'))
  document.body.appendChild(element)

  const size = element.offsetHeight

  document.body.removeChild(element)

  return size
}
