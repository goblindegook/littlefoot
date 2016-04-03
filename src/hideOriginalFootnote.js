import matches from 'dom-matches'
import classList from 'dom-classlist'
import children from './dom/children'

/**
 * Propagates the decision of deleting/hiding the original footnotes up the
 * hierarchy, eliminating any empty/fully-hidden elements containing the
 * footnotes and any horizontal rules used to denote the start of the footnote
 * section.
 *
 * @param {DOMElement} footnote Container of the footnote that was deleted/hidden.
 */
function hideFootnoteContainer(container) {
  const visibleFootnotes  = children(container, ':not(.footnote-print-only)')
  const visibleSeparators = children(container, 'hr:not(.footnote-print-only)')

  if (matches(container, ':empty') || visibleFootnotes.length === 0) {
    classList(container).add('footnote-print-only')
    hideFootnoteContainer(container.parentNode)

  } else if (visibleFootnotes.length === visibleSeparators.length) {
    children(container, 'hr').forEach((child) => classList(child).add('footnote-print-only'))
    classList(container).add('footnote-print-only')
    hideFootnoteContainer(container.parentNode)
  }
}

/**
 * Hides the original footnote. Optionally hides the footnote container if all
 * footnotes inside it are already hidden.
 *
 * @param {DOMElement} footnote Container of the footnote that was deleted/hidden.
 */
export default function hideOriginalFootnote(footnote, link) {
  classList(footnote).add('footnote-print-only')
  classList(link).add('footnote-print-only')

  hideFootnoteContainer(footnote.parentNode)
}
