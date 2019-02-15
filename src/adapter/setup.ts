import escape from 'lodash.escape'
import template from 'lodash.template'
import { Settings } from '../settings'
import { children } from './dom'
import {
  CLASS_PRINT_ONLY,
  FOOTNOTE_REF,
  FOOTNOTE_BACKLINK_REF,
  CLASS_PROCESSED,
  FOOTNOTE_ID
} from './constants'

type LinkBodyPair = [HTMLAnchorElement, HTMLElement | null]

type FootnoteProps = {
  link: HTMLAnchorElement
  reset: HTMLElement | null
  number: number
  content: string
  id: number
  reference: string
}

const setPrintOnly = (el: Element) => el.classList.add(CLASS_PRINT_ONLY)

const getFootnoteRef = (element: Element): string =>
  element.getAttribute(FOOTNOTE_REF) || ''
const setFootnoteRef = (element: Element, value: string): void =>
  element.setAttribute(FOOTNOTE_REF, value)

const getFootnoteBacklinkRef = (element: Element) =>
  element.getAttribute(FOOTNOTE_BACKLINK_REF) || ''
const setFootnoteBacklinkRef = (element: Element, value: string) =>
  element.setAttribute(FOOTNOTE_BACKLINK_REF, value)

function getLastFootnoteId(): string {
  const all = document.querySelectorAll(`[${FOOTNOTE_ID}]`)
  const lastFootnoteId =
    all.length && all[all.length - 1].getAttribute(FOOTNOTE_ID)
  return lastFootnoteId || '0'
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
  const [url, fragment] = link.href.split('#')
  setFootnoteRef(link, `#${fragment}`)
  setFootnoteBacklinkRef(link, `${id}${linkId}`)
  return link
}

export function getFootnoteLinks({
  anchorPattern,
  anchorParentSelector,
  footnoteParentClass,
  scope
}: Settings) {
  const footnoteLinkSelector = `${scope || ''} a[href*="#"]`.trim()

  return Array.from(
    document.querySelectorAll<HTMLAnchorElement>(footnoteLinkSelector)
  )
    .filter(link => {
      const anchor = `${link.href}${link.rel !== 'null' ? link.rel : ''}`

      return (
        anchor.match(anchorPattern) &&
        !link.closest(
          `[class*="${footnoteParentClass}"]:not(a):not(${anchorParentSelector})`
        )
      )
    })
    .map(link => setLinkReferences(link, anchorParentSelector))
}

const insertButton = (buttonTemplate: string) => (footnote: FootnoteProps) => {
  footnote.link.insertAdjacentHTML(
    'beforebegin',
    template(buttonTemplate)(footnote)
  )
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

const resetNumbers = (resetSelector: string) => (
  footnote: FootnoteProps,
  i: number,
  footnotes: FootnoteProps[]
): FootnoteProps => {
  const resetElement = footnote.link.closest(resetSelector)
  const { reset, number: n } = i ? footnotes[i - 1] : { reset: null, number: 0 }
  return { ...footnote, reset, number: resetElement === reset ? n + 1 : 1 }
}

function addLinkElements(
  allowDuplicates: boolean,
  footnoteSelector: string
): (link: HTMLAnchorElement) => LinkBodyPair {
  return link => {
    const selector = getFootnoteRef(link).replace(/[:.+~*[\]]/g, '\\$&')
    const strictSelector = `${selector}:not(.${CLASS_PROCESSED})`
    const related = document.querySelector(
      allowDuplicates ? selector : strictSelector
    )
    const body = related && (related.closest(footnoteSelector) as HTMLElement)

    if (body) {
      body.classList.add(CLASS_PROCESSED)
      hideOriginalFootnote(body, link)
    }

    return [link, body]
  }
}

const footnoteProperties = (offset: number) => (
  [link, body]: LinkBodyPair,
  idx: number
): FootnoteProps => {
  const num = offset + idx
  const id = offset + idx
  const reference = getFootnoteBacklinkRef(link)
  const content = escape(prepareContent(body!.innerHTML, reference))

  return {
    content,
    id,
    link,
    reference,
    number: num,
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

export function setupDocument(settings: Settings): void {
  const {
    allowDuplicates,
    buttonTemplate,
    footnoteSelector,
    numberResetSelector
  } = settings
  const offset = parseInt(getLastFootnoteId(), 10) + 1
  getFootnoteLinks(settings)
    .map(addLinkElements(allowDuplicates, footnoteSelector))
    .filter(([link, body]) => body)
    .map(footnoteProperties(offset))
    .map(numberResetSelector ? resetNumbers(numberResetSelector) : i => i)
    .map(insertButton(buttonTemplate))
}
