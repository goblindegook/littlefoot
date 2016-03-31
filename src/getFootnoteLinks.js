import closest from 'dom-closest'

/**
 * Groups the ID and HREF of a superscript/anchor tag pair in data attributes.
 *
 * This resolves the issue of the href and backlink id being separated between
 * the two elements.
 *
 * @param  {Array}  footnoteLinks        Anchors that link to footnotes.
 * @param  {String} anchorParentSelector Anchor parent selector.
 * @return {Array}                       Anchors with footnote references added.
 */
export default function mapFootnoteReferences(footnoteLinks, anchorParentSelector) {
  return footnoteLinks.map((link) => {
    const parent   = closest(link, anchorParentSelector)
    const child    = link.querySelector(anchorParentSelector)
    const parentId = parent && parent.getAttribute('id') || ''
    const childId  = child && child.getAttribute('id') || ''
    const linkId   = link.getAttribute('id') || ''
    const id       = parent ? parentId : (child ? childId : '')
    const href     = '#' + link.getAttribute('href').split('#')[1]

    link.setAttribute('data-footnote-backlink-ref', id + linkId)
    link.setAttribute('data-footnote-ref', href)

    return link
  })
}

/**
 * Find footnote links in the document.
 * @param  {Object} settings Littlefoot settings.
 * @return {Array}           Footnote links found in the document.
 */
export default function getFootnoteLinks(settings) {
  const scope                = settings.scope || ''
  const anchorPattern        = settings.anchorPattern
  const footnoteParentClass  = settings.footnoteParentClass
  const anchorParentSelector = settings.anchorParentSelector
  const footnoteLinkSelector = `${scope} a[href*="#"]`.trim()

  const footnoteLinks = Array.prototype.filter.call(
    document.querySelectorAll(footnoteLinkSelector),
    link => {
      const href   = link.getAttribute('href')
      const rel    = link.getAttribute('rel')
      const anchor = '' + href + (rel != null && rel !== 'null' ? rel : '')

      return anchor.match(anchorPattern)
        && !closest(link, '[class*=' + footnoteParentClass + ']:not(a):not(' + anchorParentSelector + ')')
    }
  )

  return mapFootnoteReferences(footnoteLinks, anchorParentSelector)
}
