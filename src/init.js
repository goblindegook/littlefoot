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
 * @param  {DOMElement} link            Footnote link.
 * @param  {String}     selector        Footnote selector.
 * @param  {Boolean}    allowDuplicates Whether to instantiate duplicate footnote.
 * @return {DOMElement}                 The closest related footnote.
 */
function getClosestFootnote (link, selector, allowDuplicates) {
  const relatedSelector = link.getAttribute(FOOTNOTE_REF).replace(/[:.+~*\[\]]/g, '\\$&') // eslint-disable-line
  const unprocessedSelector = `${relatedSelector}:not(.${CLASS_PROCESSED})`
  const relatedFootnote = document.querySelector(allowDuplicates ? relatedSelector : unprocessedSelector)

  return closest(relatedFootnote, selector)
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
    const resetElement = closest(footnote.link, numberResetSelector)
    const [previousReset, number] = i
      ? [footnotes[i - 1].resetElement, footnotes[i - 1].data.number]
      : [null, 0]

    return Object.assign(footnote, {
      resetElement,
      data: Object.assign(footnote.data, {
        number: resetElement === previousReset ? number + 1 : 1
      })
    })
  }
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
  const offset = getFootnoteOffset()

  getFootnoteLinks(settings)
    .reduce((acc, link) => {
      const element = getClosestFootnote(link, settings.footnoteSelector, settings.allowDuplicates)

      if (element) {
        classList(element).add(CLASS_PROCESSED)
      }

      return element ? [...acc, { link, element }] : acc
    }, [])
    .reduce((acc, { element, link }, i) => {
      const number = offset + i
      const id = offset + i
      const reference = link.getAttribute(FOOTNOTE_BACKLINK_REF)
      const content = escape(prepareContent(element.innerHTML, reference))

      return [...acc, {
        element,
        link,
        data: {
          content,
          id,
          number,
          reference
        }
      }]
    }, [])
    .map(settings.numberResetSelector ? resetNumbers(settings.numberResetSelector) : i => i)
    .forEach(({ element, link, data }) => {
      link.insertAdjacentHTML('beforebegin', buttonTemplate(data))
      hideOriginalFootnote(element, link)
    })
}
