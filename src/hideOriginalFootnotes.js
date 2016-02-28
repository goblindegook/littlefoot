import matches from 'dom-matches'
import addClass from './dom/addClass'
import children from './dom/children'

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
  if (matches(footnote, ':empty') || children(footnote, ':not(.footnote-print-only)').length === 0) {
    if (remove) {
      footnote.parentNode.removeChild(footnote)
    } else {
      addClass(footnote, 'footnote-print-only')
    }

    hideOriginalFootnotes(footnote.parentNode)

  } else if (children(footnote, ':not(.footnote-print-only)').length === children(footnote, 'hr:not(.footnote-print-only)').length) {
    if (remove) {
      footnote.parentNode.removeChild(footnote)
    } else {
      children(footnote, 'hr').forEach(child => addClass(child, 'footnote-print-only'))
      addClass(footnote, 'footnote-print-only')
    }

    hideOriginalFootnotes(footnote.parentNode)
  }
}
