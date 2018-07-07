import { addClass } from './document'
import { children } from './dom/children'
import { CLASS_PRINT_ONLY } from './constants'

const makeInvisible = addClass(CLASS_PRINT_ONLY)

/**
 * Propagates the decision of hiding the original footnotes up the DOM tree,
 * marking any empty or hidden containers or any horizontal rules used to
 * denote the start of the footnote section.
 *
 * @param  {DOMElement} footnote Container of the footnote that was hidden.
 * @return {void}
 */
function hideFootnoteContainer (container) {
  const visibleElements = children(container, `:not(.${CLASS_PRINT_ONLY})`)
  const visibleSeparators = visibleElements.filter(el => el.tagName === 'HR')

  if (visibleElements.length === visibleSeparators.length) {
    [...visibleSeparators, container].forEach(makeInvisible)
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
  [footnote, link].forEach(makeInvisible)
  hideFootnoteContainer(footnote.parentNode)
}
