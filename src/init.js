import closest from 'dom-closest'
import classList from 'dom-classlist'
import escape from 'lodash.escape'
import template from 'lodash.template'
import { getFootnoteLinks } from './getFootnoteLinks'
import { hideOriginalFootnote } from './hideOriginalFootnote'

/**
 * Get the closest related footnote to a footnote link.
 *
 * @param  {DOMElement} link            Footnote link.
 * @param  {String}     selector        Footnote selector.
 * @param  {Boolean}    allowDuplicates Whether to instantiate duplicate footnote.
 * @return {DOMElement}                 The closest related footnote.
 */
function getClosestFootnote (link, selector, allowDuplicates) {
  let relatedSelector = link.getAttribute('data-footnote-ref').replace(/[:.+~*\[\]]/g, '\\$&') // eslint-disable-line

  if (!allowDuplicates) {
    relatedSelector = relatedSelector + ':not(.footnote-processed)'
  }

  const relatedFootnote = document.querySelector(relatedSelector)

  return closest(relatedFootnote, selector)
}

/**
 * Get footnote starting number.
 *
 * @param  {DOMElement} element Root element, defaults to document.
 * @return {Number}             Starting number for all footnotes.
 */
function getFootnoteNumberStart (element = document) {
  const footnotes = element.querySelectorAll('[data-footnote-id]')
  const lastFootnote = footnotes[footnotes.length - 1]
  const lastFootnoteId = lastFootnote ? lastFootnote.getAttribute('data-footnote-id') : 0

  return 1 + parseInt(lastFootnoteId, 10)
}

/**
 * Removes any links from the footnote back to the footnote link as these don't
 * make sense when the footnote is shown inline.
 *
 * @param  {String} content      The HTML string of the new footnote.
 * @param  {String} backlinkId   The ID of the footnote link (that is to be
 *                               removed from the footnote content).
 * @return {String}              The new HTML string with the relevant links
 *                               taken out.
 */
function prepareContent (content, backlinkId) {
  const pattern = backlinkId.trim().replace(/\s+/g, '|')
  const regex = new RegExp('(\\s|&nbsp;)*<\\s*a[^#<]*#(' + pattern + ')[^>]*>(.*?)<\\s*/\\s*a>', 'g')

  let preparedContent = content.trim().replace(regex, '').replace('[]', '')

  if (preparedContent.indexOf('<') !== 0) {
    preparedContent = '<p>' + preparedContent + '</p>'
  }

  return preparedContent
}

/**
 * Footnote button/content initializer (run on doc.ready).
 *
 * Finds the likely footnote links and then uses their target to find the content.
 *
 * @param  {Object} settings littlefoot settings object.
 * @return {void}
 */
export function init (settings) {
  const buttonTemplate = template(settings.buttonTemplate)
  const rawFootnoteLinks = getFootnoteLinks(settings)
  const footnotes = []

  const footnoteLinks = rawFootnoteLinks.filter((footnoteLink) => {
    const closestFootnote = getClosestFootnote(footnoteLink, settings.footnoteSelector, settings.allowDuplicates)

    if (closestFootnote) {
      classList(closestFootnote).add('footnote-processed')
      footnotes.push(closestFootnote)
    }

    return closestFootnote
  })

  const numberStart = getFootnoteNumberStart()
  let previousReset = null
  let number = 0

  footnotes.forEach((footnote, i) => {
    const id = numberStart + i
    const link = footnoteLinks[i]
    const reference = link.getAttribute('data-footnote-backlink-ref')
    const content = escape(prepareContent(footnote.innerHTML, reference))

    if (settings.numberResetSelector != null) {
      const resetElement = closest(link, settings.numberResetSelector)
      number = resetElement === previousReset ? number + 1 : 1
      previousReset = resetElement
    } else {
      number = id
    }

    link.insertAdjacentHTML('beforebegin', buttonTemplate({
      content,
      id,
      number,
      reference
    }))

    hideOriginalFootnote(footnote, link)
  })
}
