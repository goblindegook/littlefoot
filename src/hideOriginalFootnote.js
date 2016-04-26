import classList from 'dom-classlist'
import children from './dom/children'

const printOnly = 'footnote-print-only'

/**
 * Mark an element for hiding by setting a print-only class.
 *
 * @param   {DOMElement} element Element to make print-only.
 * @returns {null}
 */
function hideElement(element) {
  classList(element).add(printOnly)
}

/**
 * Propagates the decision of hiding the original footnotes up the DOM tree,
 * marking any empty or hidden containers or any horizontal rules used to
 * denote the start of the footnote section.
 *
 * @param   {DOMElement} footnote Container of the footnote that was hidden.
 * @returns {null}
 */
function hideFootnoteContainer(container) {
  const visibleElements   = children(container, `:not(.${printOnly})`)
  const visibleSeparators = children(container, `hr:not(.${printOnly})`)

  if (visibleElements.length === visibleSeparators.length) {
    visibleSeparators.forEach(hideElement)
    hideElement(container)
    hideFootnoteContainer(container.parentNode)
  }
}

/**
 * Hides the original footnote. Optionally hides the footnote container if all
 * footnotes inside it are already hidden.
 *
 * @param   {DOMElement} footnote Hidden footnote container element.
 * @param   {DOMElement} link     Footnote link element.
 * @returns {null}
 */
export default function hideOriginalFootnote(footnote, link) {
  hideElement(footnote)
  hideElement(link)
  hideFootnoteContainer(footnote.parentNode)
}
