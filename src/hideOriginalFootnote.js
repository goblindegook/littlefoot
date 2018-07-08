import { addClass } from './document'
import { children } from './dom/children'
import { CLASS_PRINT_ONLY } from './constants'

const setPrintOnly = addClass(CLASS_PRINT_ONLY)

function hideFootnoteContainer (container) {
  const visibleElements = children(container, `:not(.${CLASS_PRINT_ONLY})`)
  const visibleSeparators = visibleElements.filter(el => el.tagName === 'HR')

  if (visibleElements.length === visibleSeparators.length) {
    [...visibleSeparators, container].forEach(setPrintOnly)
    hideFootnoteContainer(container.parentNode)
  }
}

/**
 * Hides the original footnote. Optionally hides the footnote container if all
 * footnotes inside it are already hidden.
 *
 * @param  {DOMElement} footnote Hidden footnote container element.
 * @param  {DOMElement} link     Footnote link element.
 * @return {void}
 */
export function hideOriginalFootnote (footnote, link) {
  [footnote, link].forEach(setPrintOnly)
  hideFootnoteContainer(footnote.parentNode)
}
