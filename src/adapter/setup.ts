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

function findFootnoteLinks({
  anchorPattern,
  anchorParentSelector,
  footnoteParentClass,
  scope = ''
}: Settings): HTMLAnchorElement[] {
  return Array.from(
    document.querySelectorAll<HTMLAnchorElement>(`${scope} a[href^="#"]`)
  ).filter(
    link =>
      `${link.href}${link.rel}`.match(anchorPattern) &&
      !link.closest(
        `[class~="${footnoteParentClass}"]:not(a):not(${anchorParentSelector})`
      )
  )
}

const createRawFootnote = ({
  anchorParentSelector,
  allowDuplicates,
  footnoteSelector
}: Settings) => (link: HTMLAnchorElement): RawFootnote | null => {
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
    return { link, reference, body }
  }

  return null
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
  const previousNumber = i ? footnotes[i - 1].number : 0
  return {
    ...footnote,
    number: footnote.link.closest(resetSelector) ? 1 : previousNumber + 1
  }
}

const templateData = (offset: number) => (
  { body, link, reference }: RawFootnote,
  idx: number
): FootnoteData => ({
  link,
  reference,
  content: escape(prepareContent(body.innerHTML, reference)),
  id: offset + idx,
  number: offset + idx
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

function isNotNull<T>(value: T | null): value is T {
  return value !== null
}

export function setupDocument(settings: Settings): HTMLElement[] {
  const { buttonTemplate, numberResetSelector } = settings
  const offset = parseInt(getLastFootnoteId(), 10) + 1

  return findFootnoteLinks(settings)
    .map(createRawFootnote(settings))
    .filter(isNotNull)
    .map(hideOriginalFootnote)
    .map(templateData(offset))
    .map(numberResetSelector ? resetNumbers(numberResetSelector) : i => i)
    .map(data => insertButton(buttonTemplate, data))
}
