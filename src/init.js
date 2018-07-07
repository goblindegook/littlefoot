import closest from 'dom-closest'
import escape from 'lodash.escape'
import template from 'lodash.template'
import { getFootnoteLinks } from './getFootnoteLinks'
import { hideOriginalFootnote } from './hideOriginalFootnote'
import { insertButton, addClass } from './document'
import {
  CLASS_PROCESSED,
  FOOTNOTE_BACKLINK_REF,
  FOOTNOTE_ID,
  FOOTNOTE_REF
} from './constants'

function prepareContent (content, backlinkId) {
  const pattern = backlinkId.trim().replace(/\s+/g, '|')
  const regex = new RegExp('(\\s|&nbsp;)*<\\s*a[^#<]*#(' + pattern + ')[^>]*>(.*?)<\\s*/\\s*a>', 'g')

  let preparedContent = content.trim().replace(regex, '').replace('[]', '')

  if (preparedContent.indexOf('<') !== 0) {
    preparedContent = '<p>' + preparedContent + '</p>'
  }

  return preparedContent
}

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

function addLinkElements (allowDuplicates, footnoteSelector) {
  return link => {
    const selector = link.getAttribute(FOOTNOTE_REF).replace(/[:.+~*\[\]]/g, '\\$&') // eslint-disable-line
    const strictSelector = `${selector}:not(.${CLASS_PROCESSED})`
    const related = document.querySelector(allowDuplicates ? selector : strictSelector)
    const element = closest(related, footnoteSelector)

    addClass(CLASS_PROCESSED)(element)

    return { element, link }
  }
}

function addFootnoteProperties () {
  const footnotes = document.querySelectorAll(`[${FOOTNOTE_ID}]`)
  const lastId = footnotes.length && footnotes[footnotes.length - 1].getAttribute(FOOTNOTE_ID)
  const offset = 1 + parseInt(lastId, 10)

  return ({ element, link }, idx) => {
    const number = offset + idx
    const id = offset + idx
    const reference = link.getAttribute(FOOTNOTE_BACKLINK_REF)
    const content = escape(prepareContent(element.innerHTML, reference))

    return { content, element, id, link, number, reference }
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

  getFootnoteLinks(settings)
    .map(addLinkElements(allowDuplicates, footnoteSelector))
    .filter(({ element }) => !!element)
    .map(addFootnoteProperties())
    .map(numberResetSelector ? resetNumbers(numberResetSelector) : i => i)
    .map(footnote => {
      insertButton(footnote.link, template(buttonTemplate), footnote)
      hideOriginalFootnote(footnote.element, footnote.link)
    })
}
