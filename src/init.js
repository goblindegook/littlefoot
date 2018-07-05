import closest from 'dom-closest'
import classList from 'dom-classlist'
import escape from 'lodash.escape'
import template from 'lodash.template'
import { getFootnoteLinks } from './getFootnoteLinks'
import { hideOriginalFootnote } from './hideOriginalFootnote'
import {
  CLASS_PROCESSED,
  FOOTNOTE_BACKLINK_REF,
  FOOTNOTE_ID,
  FOOTNOTE_REF
} from './constants'

/**
 * Get the closest related footnote to a footnote link.
 *
 * @param  {DOMElement} link             Footnote link.
 * @param  {String}     footnoteSelector Footnote selector.
 * @param  {Boolean}    allowDuplicates  Whether to instantiate duplicate footnote.
 * @return {DOMElement}                  The closest related footnote.
 */
function getClosestFootnote (link, footnoteSelector, allowDuplicates) {
  const selector = link.getAttribute(FOOTNOTE_REF).replace(/[:.+~*\[\]]/g, '\\$&') // eslint-disable-line
  const strictSelector = `${selector}:not(.${CLASS_PROCESSED})`
  const related = document.querySelector(allowDuplicates ? selector : strictSelector)

  return closest(related, footnoteSelector)
}

/**
 * Get footnote starting number.
 *
 * @param  {DOMElement} element Root element, defaults to document.
 * @return {Number}             Starting number for all footnotes.
 */
function getFootnoteOffset (element = document) {
  const footnotes = element.querySelectorAll(`[${FOOTNOTE_ID}]`)
  const lastFootnote = footnotes[footnotes.length - 1]
  const lastFootnoteId = lastFootnote ? lastFootnote.getAttribute(FOOTNOTE_ID) : 0

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
 * Creates a mapping function that resets the footnote number within
 * each selected element.
 *
 * @param  {String} numberResetSelector Element selector.
 * @return {Function}
 */
function resetNumbers (numberResetSelector) {
  return (footnote, i, footnotes) => {
    const reset = closest(footnote.link, numberResetSelector)
    const previous = i ? footnotes[i - 1] : { reset: null, number: 0 }

    return Object.assign(footnote, {
      reset: previous.reset,
      number: reset === previous.reset ? previous.number + 1 : 1
    })
  }
}

/**
 * Footnote button/content initializer (run on doc.ready).
 *
 * Finds the likely footnote links and then uses their target to find the content.
 *
 * @param  {Object} options littlefoot settings object.
 * @return {void}
 */
export function init (settings) {
  const { allowDuplicates, buttonTemplate, footnoteSelector, numberResetSelector } = settings

  const renderButton = template(buttonTemplate)
  const maybeResetNumbers = numberResetSelector ? resetNumbers(numberResetSelector) : i => i
  const offset = getFootnoteOffset()

  getFootnoteLinks(settings)
    .reduce((acc, link) => {
      const element = getClosestFootnote(link, footnoteSelector, allowDuplicates)

      if (element) {
        classList(element).add(CLASS_PROCESSED)
      }

      return [...acc, { link, element }]
    }, [])
    .filter(({ element }) => !!element)
    .reduce((acc, { element, link }, i) => {
      const number = offset + i
      const id = offset + i
      const reference = link.getAttribute(FOOTNOTE_BACKLINK_REF)
      const content = escape(prepareContent(element.innerHTML, reference))

      return [...acc, {
        content,
        element,
        id,
        link,
        number,
        reference
      }]
    }, [])
    .map(maybeResetNumbers)
    .map(footnote => {
      footnote.link.insertAdjacentHTML('beforebegin', renderButton(footnote))
      hideOriginalFootnote(footnote.element, footnote.link)
    })
}
