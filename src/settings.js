/**
 * Default settings.
 *
 * @type {Object}
 */
const DEFAULTS = {
  activateCallback: null,
  activateDelay: 100,
  activateOnHover: false,
  allowDuplicates: true,
  allowMultiple: false,
  anchorParentSelector: 'sup',
  anchorPattern: /(fn|footnote|note)[:\-_\d]/gi,
  dismissDelay: 300,
  dismissOnUnhover: false,
  footnoteParentClass: 'footnote',
  footnoteSelector: 'li',
  hoverDelay: 250,
  numberResetSelector: null,
  scope: null,
  contentTemplate: '<aside class="littlefoot-footnote is-positioned-bottom" id="fncontent:<%= id %>" data-footnote-id="<%= id %>" data-footnote-number="<%= number %>" alt="Footnote <%= number %>"><div class="littlefoot-footnote__wrapper"><div class="littlefoot-footnote__content" tabindex="0"><%= content %></div></div><div class="littlefoot-footnote__tooltip"></div></aside>',
  buttonTemplate: '<span class="littlefoot-footnote__container"><button class="littlefoot-footnote__button littlefoot-footnote__button__ellipsis" id="<%= reference %>" data-footnote-content="<%= content %>" data-footnote-id="<%= id %>" data-footnote-number="<%= number %>" alt="See Footnote <%= number %>" aria-controls="fncontent:<%= id %>" aria-expanded="false" aria-label="Footnote <%= number %>" rel="footnote"><svg viewbox="0 0 31 6" preserveAspectRatio="xMidYMid"><circle r="3" cx="3" cy="3" fill="white"></circle><circle r="3" cx="15" cy="3" fill="white"></circle><circle r="3" cx="27" cy="3" fill="white"></circle></svg></button></span>'
}

/**
 * Settings factory.
 * @param  {Object} options Littlefoot options.
 * @return {Object}         Settings.
 */
export function createSettings (options) {
  return Object.assign({}, DEFAULTS, options)
}
