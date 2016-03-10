import matches from 'dom-matches'
import classList from 'dom-classlist'
import children from './children'

/**
 * Propagates the decision of deleting/hiding the original footnotes up the
 * hierarchy, eliminating any empty/fully-hidden elements containing the
 * footnotes and any horizontal rules used to denote the start of the footnote
 * section.
 *
 * @param {DOMElement} footnote Container of the footnote that was deleted/hidden.
 * @param {Boolean}    remove   Whether to remove the original DOM elements.
 */
export default function hideOriginalFootnotes(footnote, remove = false) {
  const visibleFootnotes  = children(footnote, ':not(.footnote-print-only)')
  const visibleSeparators = children(footnote, 'hr:not(.footnote-print-only)')

  if (matches(footnote, ':empty') || visibleFootnotes.length === 0) {
    if (remove) {
      footnote.parentNode.removeChild(footnote)
    } else {
      classList(footnote).add('footnote-print-only')
    }

    hideOriginalFootnotes(footnote.parentNode)

  } else if (visibleFootnotes.length === visibleSeparators.length) {
    if (remove) {
      footnote.parentNode.removeChild(footnote)
    } else {
      children(footnote, 'hr').forEach(child => classList(child).add('footnote-print-only'))
      classList(footnote).add('footnote-print-only')
    }

    hideOriginalFootnotes(footnote.parentNode)
  }
}
