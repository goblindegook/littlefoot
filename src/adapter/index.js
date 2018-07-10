import closest from 'dom-closest'
import escape from 'lodash.escape'
import template from 'lodash.template'
import { children } from './dom/children'
import * as adapter from './document'
import * as layout from './layout'
import * as footnoteMethods from './footnotes'
import {
  CLASS_PROCESSED,
  CLASS_PRINT_ONLY
} from './constants'

export const setPrintOnly = adapter.addClass(CLASS_PRINT_ONLY)
export const setProcessed = adapter.addClass(CLASS_PROCESSED)

function getFootnoteBacklinkId (link, anchorParentSelector) {
  const parent = closest(link, anchorParentSelector)

  if (parent) {
    return parent.id
  }

  const child = link.querySelector(anchorParentSelector)

  if (child) {
    return child.id
  }

  return ''
}

function setLinkReferences (link, anchorParentSelector) {
  const id = getFootnoteBacklinkId(link, anchorParentSelector) || ''
  const linkId = link.id || ''
  const href = '#' + link.getAttribute('href').split('#')[1]
  adapter.setFootnoteRef(link, href)
  adapter.setFootnoteBacklinkRef(link, `${id}${linkId}`)
  return link
}

export function getFootnoteLinks ({
  anchorPattern,
  anchorParentSelector,
  footnoteParentClass,
  scope
}) {
  const footnoteLinkSelector = `${scope || ''} a[href*="#"]`.trim()

  return [...document.querySelectorAll(footnoteLinkSelector)]
    .filter(link => {
      const href = link.getAttribute('href')
      const rel = link.getAttribute('rel')
      const anchor = `${href}${rel != null && rel !== 'null' ? rel : ''}`

      return anchor.match(anchorPattern) &&
        !closest(link, `[class*="${footnoteParentClass}"]:not(a):not(${anchorParentSelector})`)
    })
    .map(link => setLinkReferences(link, anchorParentSelector))
}

export function insertButton (link, html) {
  link.insertAdjacentHTML('beforebegin', html)
}

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
    const selector = adapter.getFootnoteRef(link).replace(/[:.+~*\[\]]/g, '\\$&') // eslint-disable-line
    const strictSelector = `${selector}:not(.${CLASS_PROCESSED})`
    const related = document.querySelector(allowDuplicates ? selector : strictSelector)
    const element = closest(related, footnoteSelector)

    setProcessed(element)

    return { element, link }
  }
}

function assignFootnoteProperties (offset) {
  return ({ element, link }, idx) => {
    const number = offset + idx
    const id = offset + idx
    const reference = adapter.getFootnoteBacklinkRef(link)
    const content = escape(prepareContent(element.innerHTML, reference))

    return { content, element, id, link, number, reference }
  }
}

function hideFootnoteContainer (container) {
  const visibleElements = children(container, `:not(.${CLASS_PRINT_ONLY})`)
  const visibleSeparators = visibleElements.filter(el => el.tagName === 'HR')

  if (visibleElements.length === visibleSeparators.length) {
    [...visibleSeparators, container].forEach(setPrintOnly)
    hideFootnoteContainer(container.parentNode)
  }
}

function hideOriginalFootnote (footnote, link) {
  [footnote, link].forEach(setPrintOnly)
  hideFootnoteContainer(footnote.parentNode)
}

/**
 * Footnote button/content initializer (run on doc.ready).
 *
 * Finds the likely footnote links and then uses their target to find the content.
 *
 * @param  {Object} options littlefoot settings object.
 * @return {void}
 */
export function createDocumentAdapter (settings) {
  const {
    allowDuplicates,
    anchorParentSelector,
    anchorPattern,
    buttonTemplate,
    footnoteParentClass,
    footnoteSelector,
    numberResetSelector,
    scope
  } = settings

  const offset = parseInt(adapter.getLastFootnoteId(), 10) + 1

  getFootnoteLinks({ anchorPattern, anchorParentSelector, footnoteParentClass, scope })
    .map(addLinkElements(allowDuplicates, footnoteSelector))
    .filter(({ element }) => element)
    .map(assignFootnoteProperties(offset))
    .map(numberResetSelector ? resetNumbers(numberResetSelector) : i => i)
    .map(footnote => {
      insertButton(footnote.link, template(buttonTemplate)(footnote))
      hideOriginalFootnote(footnote.element, footnote.link)
    })

  return Object.assign({}, adapter, footnoteMethods, layout)
}
