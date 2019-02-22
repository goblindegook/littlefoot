import escape from 'lodash.escape'
import template from 'lodash.template'
import { Settings } from '../settings'
import { children } from './dom'
import { CLASS_PRINT_ONLY, CLASS_PROCESSED, FOOTNOTE_ID } from './constants'

type RawFootnote = {
  link: HTMLAnchorElement
  body: HTMLElement
  reference: string
}

type FootnoteData = {
  link: HTMLAnchorElement
  reset: HTMLElement | null
  content: string
  id: number
  number: number
  reference: string
}

const setPrintOnly = (el: Element) => el.classList.add(CLASS_PRINT_ONLY)

function getLastFootnoteId(): string {
  const footnotes = document.querySelectorAll(`[${FOOTNOTE_ID}]`)
  const lastFootnoteId =
    footnotes.length &&
    footnotes[footnotes.length - 1].getAttribute(FOOTNOTE_ID)
  return lastFootnoteId || '0'
}

function getBacklinkId(
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

function getHrefRel(link: HTMLAnchorElement): string {
  return link.href + (link.rel !== 'null' ? link.rel : '')
}

function findFootnoteLinks({
  anchorPattern,
  anchorParentSelector,
  footnoteParentClass,
  scope
}: Settings): HTMLAnchorElement[] {
  const footnoteLinkSelector = `${scope || ''} a[href*="#"]`.trim()

  return Array.from(
    document.querySelectorAll<HTMLAnchorElement>(footnoteLinkSelector)
  ).filter(
    link =>
      getHrefRel(link).match(anchorPattern) &&
      !link.closest(
        `[class*="${footnoteParentClass}"]:not(a):not(${anchorParentSelector})`
      )
  )
}

const createRawFootnote = ({
  anchorParentSelector,
  allowDuplicates,
  footnoteSelector
}: Settings) => (
  footnotes: RawFootnote[],
  link: HTMLAnchorElement
): RawFootnote[] => {
  const id = getBacklinkId(link, anchorParentSelector) || ''
  const linkId = link.id || ''
  const reference = `${id}${linkId}`

  const [_, fragment] = link.href.split('#')
  const selector = '#' + fragment.replace(/[:.+~*[\]]/g, '\\$&')
  const strictSelector = `${selector}:not(.${CLASS_PROCESSED})`
  const related = document.querySelector(
    allowDuplicates ? selector : strictSelector
  )
  const body = related && (related.closest(footnoteSelector) as HTMLElement)

  if (body) {
    body.classList.add(CLASS_PROCESSED)
    return [...footnotes, { link, reference, body }]
  }

  return footnotes
}

function prepareContent(content: string, reference: string): string {
  const pattern = reference.trim().replace(/\s+/g, '|')
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
  footnote: FootnoteData,
  i: number,
  footnotes: FootnoteData[]
): FootnoteData => {
  const resetElement = footnote.link.closest(resetSelector)
  const { reset, number: n } = i ? footnotes[i - 1] : { reset: null, number: 0 }
  return { ...footnote, reset, number: resetElement === reset ? n + 1 : 1 }
}

const templateData = (offset: number) => (
  { body, link, reference }: RawFootnote,
  idx: number
): FootnoteData => ({
  link,
  reference,
  content: escape(prepareContent(body.innerHTML, reference)),
  id: offset + idx,
  number: offset + idx,
  reset: null
})

function hideFootnoteContainer(container: HTMLElement): void {
  const visibleElements = children(container, `:not(.${CLASS_PRINT_ONLY})`)
  const visibleSeparators = visibleElements.filter(el => el.tagName === 'HR')

  if (visibleElements.length === visibleSeparators.length) {
    ;[...visibleSeparators, container].forEach(setPrintOnly)
    hideFootnoteContainer(container.parentNode as HTMLElement)
  }
}

function hideOriginalFootnote(footnote: RawFootnote): RawFootnote {
  setPrintOnly(footnote.body)
  setPrintOnly(footnote.link)
  hideFootnoteContainer(footnote.body.parentNode as HTMLElement)
  return footnote
}

const insertButton = (
  buttonTemplate: string,
  data: FootnoteData
): HTMLElement => {
  data.link.insertAdjacentHTML('beforebegin', template(buttonTemplate)(data))
  return data.link.previousElementSibling as HTMLElement
}

export function setupDocument(settings: Settings): HTMLElement[] {
  const { buttonTemplate, numberResetSelector } = settings
  const offset = parseInt(getLastFootnoteId(), 10) + 1

  return findFootnoteLinks(settings)
    .reduce(createRawFootnote(settings), [])
    .map(hideOriginalFootnote)
    .map(templateData(offset))
    .map(numberResetSelector ? resetNumbers(numberResetSelector) : i => i)
    .map(data => insertButton(buttonTemplate, data))
}
