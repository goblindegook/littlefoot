/**
   * Removes/adds appropriate classes to the footnote content and button after
   * a delay (to allow for transitions) it removes the actual footnote content.
   *
   * @param  {DOMElement} element
   * @param  {String}     type
   * @param  {Function}   fn
   * @param  {boolean}    capture
   * @return {void}
   */
export function bind (el, type, fn, capture = false) {
  const method = window.addEventListener ? 'addEventListener' : 'attachEvent'
  const prefix = method !== 'addEventListener' ? 'on' : ''
  el[method](prefix + type, fn, capture)
}
