import escape from 'lodash.escape'
import template from 'lodash.template'
import { children } from './dom'
import * as adapter from './footnotes'
import {
  CLASS_PROCESSED,
  CLASS_PRINT_ONLY,
  FOOTNOTE_ID,
  FOOTNOTE_REF,
  FOOTNOTE_BACKLINK_REF
} from './constants'
import { Settings } from '../settings'

export type DOMAdapter = typeof adapter

export const setPrintOnly = (el: Element) => el.classList.add(CLASS_PRINT_ONLY)
export const setProcessed = (el: Element) => el.classList.add(CLASS_PROCESSED)

const getFootnoteRef = (element: Element): string =>
  element.getAttribute(FOOTNOTE_REF) || ''
const setFootnoteRef = (element: Element, value: string): void =>
  element.setAttribute(FOOTNOTE_REF, value)

const getFootnoteBacklinkRef = (element: Element) =>
  element.getAttribute(FOOTNOTE_BACKLINK_REF) || ''
const setFootnoteBacklinkRef = (element: Element, value: string) =>
  element.setAttribute(FOOTNOTE_BACKLINK_REF, value)

function getLastFootnoteId(): number {
  const footnotes = document.querySelectorAll(`[${FOOTNOTE_ID}]`)
  return footnotes.length
    ? parseInt(
        footnotes[footnotes.length - 1].getAttribute(FOOTNOTE_ID) || '0',
        10
      )
    : 0
}

function getFootnoteBacklinkId(
  link: HTMLAnchorElement,
  anchorParentSelector: string
): string {
  const parent = link.closest(anchorParentSelector)

  if (parent) {
    return parent.id
  }

  const child = link.querySelector(anchorParentSelector)

  if (child) {
    return child.id
  }

  return ''
}

function setLinkReferences(
  link: HTMLAnchorElement,
  anchorParentSelector: string
): HTMLAnchorElement {
  const id = getFootnoteBacklinkId(link, anchorParentSelector) || ''
  const linkId = link.id || ''
  const href = '#' + link.href.split('#')[1]
  setFootnoteRef(link, href)
  setFootnoteBacklinkRef(link, `${id}${linkId}`)
  return link
}

export function getFootnoteLinks({
  anchorPattern,
  anchorParentSelector,
  footnoteParentClass,
  scope
}: {
  anchorPattern: RegExp
  anchorParentSelector: string
  footnoteParentClass: string
  scope: string | null
}) {
  const footnoteLinkSelector = `${scope || ''} a[href*="#"]`.trim()

  return Array.from(
    document.querySelectorAll<HTMLAnchorElement>(footnoteLinkSelector)
  )
    .filter(link => {
      const anchor = `${link.href}${
        link.rel != null && link.rel !== 'null' ? link.rel : ''
      }`

      return (
        anchor.match(anchorPattern) &&
        !link.closest(
          `[class*="${footnoteParentClass}"]:not(a):not(${anchorParentSelector})`
        )
      )
    })
    .map(link => setLinkReferences(link, anchorParentSelector))
}

export function insertButton(link: HTMLAnchorElement, html: string): void {
  link.insertAdjacentHTML('beforebegin', html)
}

function prepareContent(content: string, backlinkId: string): string {
  const pattern = backlinkId.trim().replace(/\s+/g, '|')
  const regex = new RegExp(
    '(\\s|&nbsp;)*<\\s*a[^#<]*#(' + pattern + ')[^>]*>(.*?)<\\s*/\\s*a>',
    'g'
  )

  let preparedContent = content
    .trim()
    .replace(regex, '')
    .replace('[]', '')

  if (preparedContent.indexOf('<') !== 0) {
    preparedContent = '<p>' + preparedContent + '</p>'
  }

  return preparedContent
}

type RawFootnote = {
  element: HTMLElement | null
  link: HTMLAnchorElement
  number: number
}

type FootnoteProps = {
  element: HTMLElement
  link: HTMLAnchorElement
  reset: HTMLElement | null
  number: number
  content: string
  id: number
  reference: string
}

const resetNumbers = (numberResetSelector: string) => (
  footnote: FootnoteProps,
  i: number,
  footnotes: FootnoteProps[]
): FootnoteProps => {
  const reset = footnote.link.closest(numberResetSelector)
  const previous = i ? footnotes[i - 1] : { reset: null, number: 0 }

  return {
    ...footnote,
    reset: previous.reset,
    number: reset === previous.reset ? previous.number + 1 : 1
  }
}

function addLinkElements(
  allowDuplicates: boolean,
  footnoteSelector: string
): (link: HTMLAnchorElement) => RawFootnote {
  return link => {
    const selector = getFootnoteRef(link).replace(/[:.+~*[\]]/g, '\\$&')
    const strictSelector = `${selector}:not(.${CLASS_PROCESSED})`
    const related = document.querySelector(
      allowDuplicates ? selector : strictSelector
    )
    const element =
      related && (related.closest(footnoteSelector) as HTMLElement)

    if (element) {
      setProcessed(element)
    }

    return { element, link, reset: null, number: 0 }
  }
}

const footnoteProperties = (offset: number) => (
  { element, link }: RawFootnote,
  idx: number
): FootnoteProps => {
  const number = offset + idx
  const id = offset + idx
  const reference = getFootnoteBacklinkRef(link)
  const content = escape(prepareContent(element!.innerHTML, reference))

  return {
    content,
    element: element!,
    id,
    link,
    number,
    reference,
    reset: null
  }
}

function hideFootnoteContainer(container: HTMLElement): void {
  const visibleElements = children(container, `:not(.${CLASS_PRINT_ONLY})`)
  const visibleSeparators = visibleElements.filter(el => el.tagName === 'HR')

  if (visibleElements.length === visibleSeparators.length) {
    ;[...visibleSeparators, container].forEach(setPrintOnly)
    hideFootnoteContainer(container.parentNode as HTMLElement)
  }
}

function hideOriginalFootnote(footnote: HTMLElement, link: HTMLElement) {
  setPrintOnly(footnote)
  setPrintOnly(link)
  hideFootnoteContainer(footnote.parentNode as HTMLElement)
}

export function createDocumentAdapter(settings: Settings): DOMAdapter {
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

  const offset = getLastFootnoteId() + 1

  getFootnoteLinks({
    anchorPattern,
    anchorParentSelector,
    footnoteParentClass,
    scope
  })
    .map(addLinkElements(allowDuplicates, footnoteSelector))
    .filter(({ element }) => element)
    .map(footnoteProperties(offset))
    .map(numberResetSelector ? resetNumbers(numberResetSelector) : i => i)
    .map(footnote => {
      insertButton(footnote.link, template(buttonTemplate)(footnote))
      hideOriginalFootnote(footnote.element, footnote.link)
    })

  return adapter
}
