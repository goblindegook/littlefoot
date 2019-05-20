import { TemplateExecutor } from 'lodash'
import template from 'lodash.template'
import { FOOTNOTE_SELECTOR } from './constants'
import { RawFootnote } from '.'
import { Settings } from '../types'

type RefBody = readonly [HTMLElement, HTMLElement]
type RefBodyNumber = readonly [HTMLElement, HTMLElement, number]

const CLASS_PRINT_ONLY = 'footnote-print-only'
const CLASS_HOST = 'littlefoot-footnote__host'

const setPrintOnly = (el: Element) => el.classList.add(CLASS_PRINT_ONLY)

function children(element: Element, selector?: string): Element[] {
  return Array.from(element.children).filter(
    child => child.nodeType !== 8 && (!selector || child.matches(selector))
  )
}

function isDefined<T>(value?: T): value is T {
  return value !== undefined
}

function getNextFootnoteId(): number {
  const footnotes = document.querySelectorAll<HTMLElement>(FOOTNOTE_SELECTOR)
  const lastFootnoteId = footnotes.length
    ? footnotes[footnotes.length - 1].dataset.footnoteId!
    : '0'
  return 1 + parseInt(lastFootnoteId, 10)
}

function findFootnoteLinks({
  anchorPattern,
  scope = ''
}: Settings): readonly HTMLAnchorElement[] {
  return Array.from(
    document.querySelectorAll<HTMLAnchorElement>(scope + ' a[href^="#"]')
  ).filter(link => (link.href + link.rel).match(anchorPattern))
}

function findRefBody({
  allowDuplicates,
  anchorParentSelector,
  footnoteSelector
}: Settings) {
  const processed: Element[] = []

  return (link: HTMLAnchorElement): RefBody | undefined => {
    const [_, fragment] = link.href.split('#')
    const selector = '#' + fragment.replace(/[:.+~*[\]]/g, '\\$&')
    const related = Array.from(document.querySelectorAll(selector)).find(
      footnote => allowDuplicates || !processed.includes(footnote)
    )
    const body = related && (related.closest(footnoteSelector) as HTMLElement)

    if (body) {
      processed.push(body)
      const reference = link.closest(anchorParentSelector) as HTMLElement
      return [reference || link, body]
    }
  }
}

function prepareContent(content: string, reference: string): string {
  const pattern = reference.trim().replace(/\s+/g, '|')
  const regex = new RegExp(
    '(\\s|&nbsp;)*<\\s*a[^#<]*#(' + pattern + ')[^>]*>(.*?)<\\s*/\\s*a>',
    'g'
  )

  const preparedContent = content
    .trim()
    .replace(regex, '')
    .replace('[]', '')

  return preparedContent.startsWith('<')
    ? preparedContent
    : '<p>' + preparedContent + '</p>'
}

const resetNumbers = (resetSelector: string) => (
  [ref, body, n]: RefBodyNumber,
  idx: number,
  footnotes: RefBodyNumber[]
): RefBodyNumber => {
  const previousNumber = n ? footnotes[n - 1][2] : 0
  return [ref, body, ref.closest(resetSelector) ? 1 : previousNumber + 1]
}

const footnoteNumbers = (offset: number) => (
  [reference, body]: RefBody,
  idx: number
): RefBodyNumber => [reference, body, offset + idx]

function hideFootnoteContainer(container: HTMLElement): void {
  const visibleElements = children(container, `:not(.${CLASS_PRINT_ONLY})`)
  const visibleSeparators = visibleElements.filter(el => el.tagName === 'HR')

  if (visibleElements.length === visibleSeparators.length) {
    visibleSeparators.concat(container).forEach(setPrintOnly)
    hideFootnoteContainer(container.parentNode as HTMLElement)
  }
}

function addButton(buttonTemplate: string, contentTemplate: string) {
  const renderButton = template(buttonTemplate)
  const renderContent = template(contentTemplate)

  return ([reference, body, n]: RefBodyNumber, index: number): RawFootnote => {
    const id = `${index + 1}`

    const templateData = {
      number: n,
      id,
      content: prepareContent(body.innerHTML, reference.id),
      reference: reference.id
    }

    reference.insertAdjacentHTML(
      'beforebegin',
      `<span class="${CLASS_HOST}">${renderButton(templateData)}</span>`
    )

    const host = reference.previousElementSibling as HTMLElement
    const button = host.firstElementChild as HTMLElement
    button.dataset.footnoteButton = ''
    button.dataset.footnoteId = id
    button.dataset.footnoteNumber = `${n}`

    return {
      id,
      body,
      button,
      host,
      content: renderContent(templateData),
      isHovered: false,
      maxHeight: 0
    }
  }
}

function hideOriginalFootnote([reference, body]: RefBody): RefBody {
  setPrintOnly(reference)
  setPrintOnly(body)
  hideFootnoteContainer(body.parentElement as HTMLElement)
  return [reference, body]
}

export function createDocumentFootnotes(settings: Settings): RawFootnote[] {
  const { buttonTemplate, contentTemplate, numberResetSelector } = settings
  const offset = getNextFootnoteId()

  return findFootnoteLinks(settings)
    .map(findRefBody(settings))
    .filter(isDefined)
    .map(hideOriginalFootnote)
    .map(footnoteNumbers(offset))
    .map(numberResetSelector ? resetNumbers(numberResetSelector) : i => i)
    .map(addButton(buttonTemplate, contentTemplate))
}

export function restoreOriginalFootnotes(): void {
  Array.from(document.querySelectorAll('.' + CLASS_PRINT_ONLY)).forEach(
    element => element.classList.remove(CLASS_PRINT_ONLY)
  )
}
