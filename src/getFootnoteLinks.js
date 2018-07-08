import closest from 'dom-closest'
import {
  FOOTNOTE_BACKLINK_REF,
  FOOTNOTE_REF
} from './constants'

/**
 * Obtain the ID attribute from a footnote link element's closest parent or child.
 *
 * @param  {DOMElement} link                 Footnote link element.
 * @param  {String}     anchorParentSelector Anchor parent selector.
 * @return {String}                          Link ID.
 */
function getFootnoteBacklinkId (link, anchorParentSelector) {
  const parent = closest(link, anchorParentSelector)

  if (parent) {
    return parent.getAttribute('id')
  }

  const child = link.querySelector(anchorParentSelector)

  if (child) {
    return child.getAttribute('id')
  }

  return ''
}

/**
 * Find footnote links in the document.
 * @param  {Object} settings Littlefoot settings.
 * @return {Array}           Footnote links found in the document.
 */
export function getFootnoteLinks (settings) {
  const { anchorPattern, anchorParentSelector, footnoteParentClass, scope } = settings
  const footnoteLinkSelector = `${scope || ''} a[href*="#"]`.trim()

  return [...document.querySelectorAll(footnoteLinkSelector)]
    .filter(link => {
      const href = link.getAttribute('href')
      const rel = link.getAttribute('rel')
      const anchor = `${href}${rel != null && rel !== 'null' ? rel : ''}`

      return anchor.match(anchorPattern) &&
        !closest(link, `[class*="${footnoteParentClass}"]:not(a):not(${anchorParentSelector})`)
    })
    .map(link => {
      const id = getFootnoteBacklinkId(link, anchorParentSelector) || ''
      const linkId = link.getAttribute('id') || ''
      const href = '#' + link.getAttribute('href').split('#')[1]

      link.setAttribute(FOOTNOTE_BACKLINK_REF, id + linkId)
      link.setAttribute(FOOTNOTE_REF, href)

      return link
    })
}
