import { TemplateExecutor } from 'lodash'
import escape from 'lodash.escape'
import template from 'lodash.template'
import { Settings } from '../settings'
import { children } from './dom'
import { isNotNull } from '../isNotNull'
import { CLASS_PRINT_ONLY, CLASS_PROCESSED, FOOTNOTE_ID } from './constants'
import { HTMLFootnote } from '.'
import { TemplateData } from '../types'

type LinkBody = [HTMLAnchorElement, HTMLElement]
type LinkBodyData = [HTMLAnchorElement, HTMLElement, TemplateData]

const setPrintOnly = (el: Element) => el.classList.add(CLASS_PRINT_ONLY)

function getLastFootnoteId(): string {
  const footnotes = document.querySelectorAll(`[${FOOTNOTE_ID}]`)
  const lastFootnoteId =
    footnotes.length &&
    footnotes[footnotes.length - 1].getAttribute(FOOTNOTE_ID)
  return lastFootnoteId || '0'
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

const findFootnoteBody = ({ allowDuplicates, footnoteSelector }: Settings) => (
  link: HTMLAnchorElement
): LinkBody | null => {
  const [_, fragment] = link.href.split('#')
  const selector = '#' + fragment.replace(/[:.+~*[\]]/g, '\\$&')
  const strictSelector = `${selector}:not(.${CLASS_PROCESSED})`
  const related = document.querySelector(
    allowDuplicates ? selector : strictSelector
  )
  const body = related && (related.closest(footnoteSelector) as HTMLElement)

  if (body) {
    body.classList.add(CLASS_PROCESSED)
    return [link, body]
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
  [link, body, data]: LinkBodyData,
  i: number,
  footnotes: LinkBodyData[]
): LinkBodyData => {
  const previousNumber = i ? footnotes[i - 1][2].number : 0
  return [
    link,
    body,
    { ...data, number: link.closest(resetSelector) ? 1 : previousNumber + 1 }
  ]
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

const templateData = (anchorParentSelector: string, offset: number) => (
  [link, body]: LinkBody,
  idx: number
): LinkBodyData => {
  const backlinkId = getBacklinkId(link, anchorParentSelector)
  const reference = `${backlinkId}${link.id}`

  return [
    link,
    body,
    {
      reference,
      content: escape(prepareContent(body.innerHTML, reference)),
      id: offset + idx,
      number: offset + idx
    }
  ]
}

function hideFootnoteContainer(container: HTMLElement): void {
  const visibleElements = children(container, `:not(.${CLASS_PRINT_ONLY})`)
  const visibleSeparators = visibleElements.filter(el => el.tagName === 'HR')

  if (visibleElements.length === visibleSeparators.length) {
    ;[...visibleSeparators, container].forEach(setPrintOnly)
    hideFootnoteContainer(container.parentNode as HTMLElement)
  }
}

const addButton = (render: TemplateExecutor) => ([
  link,
  body,
  data
]: LinkBodyData): HTMLFootnote => {
  link.insertAdjacentHTML('beforebegin', render(data))
  return {
    data,
    link,
    body,
    button: link.previousElementSibling as HTMLElement
  }
}

function hideOriginalFootnote([link, body]: LinkBody): LinkBody {
  setPrintOnly(link)
  setPrintOnly(body)
  hideFootnoteContainer(body.parentNode as HTMLElement)
  return [link, body]
}

export function documentFootnotes(settings: Settings): HTMLFootnote[] {
  const { anchorParentSelector, buttonTemplate, numberResetSelector } = settings
  const offset = parseInt(getLastFootnoteId(), 10) + 1

  return findFootnoteLinks(settings)
    .map(findFootnoteBody(settings))
    .filter(isNotNull)
    .map(hideOriginalFootnote)
    .map(templateData(anchorParentSelector, offset))
    .map(numberResetSelector ? resetNumbers(numberResetSelector) : i => i)
    .map(addButton(template(buttonTemplate)))
}
