import matches from 'dom-matches'
import classList from 'dom-classlist'
import children from './dom/children'

const printOnly = 'footnote-print-only'

/**
 * Propagates the decision of deleting/hiding the original footnotes up the
 * hierarchy, eliminating any empty/fully-hidden elements containing the
 * footnotes and any horizontal rules used to denote the start of the footnote
 * section.
 *
 * @param   {DOMElement} footnote Container of the footnote that was deleted/hidden.
 * @returns {null}
 */
function hideFootnoteContainer(container) {
  const visibleFootnotes  = children(container, `:not(.${printOnly})`)
  const visibleSeparators = children(container, `hr:not(.${printOnly})`)

  if (matches(container, ':empty') || visibleFootnotes.length === 0) {
    classList(container).add(printOnly)
    hideFootnoteContainer(container.parentNode)

  } else if (visibleFootnotes.length === visibleSeparators.length) {
    children(container, 'hr').forEach((child) => classList(child).add(printOnly))
    classList(container).add(printOnly)
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
  classList(footnote).add(printOnly)
  classList(link).add(printOnly)

  hideFootnoteContainer(footnote.parentNode)
}
