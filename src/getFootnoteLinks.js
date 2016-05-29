import closest from 'component-closest';

/**
 * Obtain the ID attribute from a footnote link element's closest parent or child.
 *
 * @param  {DOMElement} link                 Footnote link element.
 * @param  {String}     anchorParentSelector Anchor parent selector.
 * @return {String}                          Link ID.
 */
function getFootnoteBacklinkId(link, anchorParentSelector) {
  const parent = closest(link, anchorParentSelector);

  if (parent) {
    return parent.getAttribute('id');
  }

  const child = link.querySelector(anchorParentSelector);

  if (child) {
    return child.getAttribute('id');
  }

  return '';
}

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
function mapFootnoteReferences(footnoteLinks, anchorParentSelector) {
  return footnoteLinks.map((link) => {
    const id     = getFootnoteBacklinkId(link, anchorParentSelector) || '';
    const linkId = link.getAttribute('id') || '';
    const href   = '#' + link.getAttribute('href').split('#')[1];

    link.setAttribute('data-footnote-backlink-ref', id + linkId);
    link.setAttribute('data-footnote-ref', href);

    return link;
  })
}

/**
 * Find footnote links in the document.
 * @param  {Object} settings Littlefoot settings.
 * @return {Array}           Footnote links found in the document.
 */
function getFootnoteLinks(settings) {
  const scope                = settings.scope || '';
  const anchorPattern        = settings.anchorPattern;
  const footnoteParentClass  = settings.footnoteParentClass;
  const anchorParentSelector = settings.anchorParentSelector;
  const footnoteLinkSelector = `${scope} a[href*="#"]`.trim();

  const footnoteLinks = Array.prototype.filter.call(
    document.querySelectorAll(footnoteLinkSelector),
    (link) => {
      const href   = link.getAttribute('href');
      const rel    = link.getAttribute('rel');
      const anchor = '' + href + (rel != null && rel !== 'null' ? rel : '');

      return anchor.match(anchorPattern)
        && !closest(link, `[class*="${footnoteParentClass}"]:not(a):not(${anchorParentSelector})`);
    }
  );

  return mapFootnoteReferences(footnoteLinks, anchorParentSelector);
}

export default getFootnoteLinks;
