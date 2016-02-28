import closest from 'dom-closest'

/**
 * Get the closest related footnote to a footnote link.
 *
 * @param  {DOMElement} link            Footnote link.
 * @param  {String}     selector        Footnote selector.
 * @param  {Boolean}    allowDuplicates Whether to instantiate duplicate footnote.
 * @return {DOMElement}                 The closest related footnote.
 */
export default function getClosestFootnote(link, selector, allowDuplicates) {
  let relatedSelector = link.getAttribute('data-footnote-ref').replace(/[:.+~*\]\[]/g, '\\$&')

  if (!allowDuplicates) {
    relatedSelector = relatedSelector + ':not(.footnote-processed)'
  }

  const relatedFootnote = document.querySelector(relatedSelector)

  return closest(relatedFootnote, selector)
}
