import template from 'lodash.template'
import { Settings, Footnote } from '../types'
import { FootnoteElements } from './types'
import { createFootnote } from './footnote'
import { CLASS_CONTENT } from './layout'
import { bindContentScrollHandler } from './events'

type RefBody = readonly [HTMLElement, HTMLElement]
type RefBodyNumber = readonly [HTMLElement, HTMLElement, number]

const CLASS_PRINT_ONLY = 'footnote-print-only'
const CLASS_HOST = 'littlefoot-footnote__host'

const setPrintOnly = (el: Element) => el.classList.add(CLASS_PRINT_ONLY)

function queryAll<E extends Element>(
  container: Document | Element,
  selector: string
): readonly E[] {
  return Array.from(container.querySelectorAll<E>(selector))
}

function children(element: Element, selector?: string): Element[] {
  return Array.from(element.children).filter(
    child => child.nodeType !== 8 && (!selector || child.matches(selector))
  )
}

function isDefined<T>(value?: T): value is T {
  return value !== undefined
}

function findFootnoteLinks(
  pattern: RegExp,
  scope = ''
): readonly HTMLAnchorElement[] {
  return queryAll<HTMLAnchorElement>(document, scope + ' a[href^="#"]').filter(
    link => (link.href + link.rel).match(pattern)
  )
}

function findRefBody(
  allowDuplicates: boolean,
  anchorParentSelector: string,
  footnoteSelector: string
) {
  const processed: Element[] = []

  return (link: HTMLAnchorElement): RefBody | undefined => {
    const fragment = link.href.split('#')[1]
    const selector = '#' + fragment.replace(/[:.+~*[\]]/g, '\\$&')
    const related = queryAll(document, selector).find(
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

const footnoteNumbers = (
  [reference, body]: RefBody,
  idx: number
): RefBodyNumber => [reference, body, 1 + idx]

function hideFootnoteContainer(container: HTMLElement): void {
  const visibleElements = children(container, `:not(.${CLASS_PRINT_ONLY})`)
  const visibleSeparators = visibleElements.filter(el => el.tagName === 'HR')

  if (visibleElements.length === visibleSeparators.length) {
    visibleSeparators.concat(container).forEach(setPrintOnly)
    hideFootnoteContainer(container.parentNode as HTMLElement)
  }
}

function createElementFromHTML(html: string): HTMLElement {
  const container = document.createElement('div')
  container.innerHTML = html
  return container.firstElementChild as HTMLElement
}

function findPopoverContent(popover: HTMLElement): HTMLElement {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return popover.querySelector<HTMLElement>('.' + CLASS_CONTENT)!
}

function insertFootnoteElements(
  buttonTemplate: string,
  popoverTemplate: string
) {
  const renderButton = template(buttonTemplate)
  const renderPopover = template(popoverTemplate)

  return (
    [reference, body, n]: RefBodyNumber,
    index: number
  ): FootnoteElements => {
    const id = `${index + 1}`
    const data = {
      number: n,
      id,
      content: prepareContent(body.innerHTML, reference.id),
      reference: reference.id
    }

    reference.insertAdjacentHTML(
      'beforebegin',
      `<span class="${CLASS_HOST}">${renderButton(data)}</span>`
    )

    const host = reference.previousElementSibling as HTMLElement

    const button = host.firstElementChild as HTMLElement
    button.dataset.footnoteButton = ''
    button.dataset.footnoteId = id
    button.dataset.footnoteNumber = `${n}`

    const popover = createElementFromHTML(renderPopover(data))
    popover.dataset.footnotePopover = ''
    popover.dataset.footnoteId = id

    const content = findPopoverContent(popover)
    bindContentScrollHandler(content)

    return { id, button, host, popover, content }
  }
}

function hideOriginalFootnote([reference, body]: RefBody): RefBody {
  setPrintOnly(reference)
  setPrintOnly(body)
  hideFootnoteContainer(body.parentElement as HTMLElement)
  return [reference, body]
}

export function restoreOriginalFootnotes(): void {
  queryAll(document, '.' + CLASS_PRINT_ONLY).forEach(element =>
    element.classList.remove(CLASS_PRINT_ONLY)
  )
}

export function createDocumentFootnotes(settings: Settings): Footnote[] {
  const {
    allowDuplicates,
    anchorParentSelector,
    anchorPattern,
    buttonTemplate,
    contentTemplate,
    footnoteSelector,
    numberResetSelector,
    scope
  } = settings

  return findFootnoteLinks(anchorPattern, scope)
    .map(findRefBody(allowDuplicates, anchorParentSelector, footnoteSelector))
    .filter(isDefined)
    .map(hideOriginalFootnote)
    .map(footnoteNumbers)
    .map(numberResetSelector ? resetNumbers(numberResetSelector) : i => i)
    .map(insertFootnoteElements(buttonTemplate, contentTemplate))
    .map(createFootnote)
}
