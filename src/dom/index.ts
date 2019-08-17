import template from 'lodash.template'
import { Settings } from '../settings'
import { createFootnote, FootnoteElements } from './footnote'
import { CLASS_CONTENT, CLASS_WRAPPER, unmount } from './layout'
import { bindScrollHandler } from './events'
import { Footnote } from '../core'

type TemplateData = Readonly<{
  number: number
  id: string
  content: string
  reference: string
}>

type RefBody = readonly [HTMLElement, HTMLElement]
type RefData = readonly [HTMLElement, TemplateData]

const CLASS_PRINT_ONLY = 'footnote-print-only'
const CLASS_HOST = 'littlefoot-footnote__host'

const setPrintOnly = (el: Element) => el.classList.add(CLASS_PRINT_ONLY)

function queryAll<E extends Element>(
  container: Document | Element,
  selector: string
): readonly E[] {
  return Array.from(container.querySelectorAll<E>(selector))
}

function getFirstElementByClass<E extends HTMLElement>(
  container: HTMLElement,
  className: string
): E {
  return (
    container.querySelector<E>('.' + className) ||
    (container.firstElementChild as E) ||
    container
  )
}

function createElementFromHTML(html: string): HTMLElement {
  const container = document.createElement('div')
  container.innerHTML = html
  return container.firstElementChild as HTMLElement
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
  return queryAll<HTMLAnchorElement>(document, scope + ' a[href*="#"]').filter(
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

function hideFootnoteContainer(container: HTMLElement): void {
  const visibleElements = children(container, `:not(.${CLASS_PRINT_ONLY})`)
  const visibleSeparators = visibleElements.filter(el => el.tagName === 'HR')

  if (visibleElements.length === visibleSeparators.length) {
    visibleSeparators.concat(container).forEach(setPrintOnly)
    hideFootnoteContainer(container.parentNode as HTMLElement)
  }
}

function hideOriginalFootnote([reference, body]: RefBody): RefBody {
  setPrintOnly(reference)
  setPrintOnly(body)
  hideFootnoteContainer(body.parentElement as HTMLElement)
  return [reference, body]
}

function unmountRecursive(element: HTMLElement) {
  const parent = element.parentElement
  unmount(element)
  const html =
    parent &&
    parent.innerHTML
      .replace('[]', '')
      .replace('&nbsp;', ' ')
      .trim()
  if (parent && !html) {
    unmountRecursive(parent)
  }
}

function prepareTemplateData([reference, body]: RefBody, idx: number): RefData {
  const content = body.cloneNode(true) as HTMLElement
  queryAll<HTMLElement>(content, '[href$="#' + reference.id + '"]').forEach(
    unmountRecursive
  )

  const data: TemplateData = {
    id: `${idx + 1}`,
    number: idx + 1,
    reference: reference.id,
    content: content.innerHTML.startsWith('<')
      ? content.innerHTML
      : '<p>' + content.innerHTML + '</p>'
  }

  return [reference, data]
}

const resetNumbers = (resetSelector: string) => (
  [ref, data]: RefData,
  idx: number,
  footnotes: RefData[]
): RefData => {
  const reset = ref.closest(resetSelector)
  const previousNumber = data.number ? footnotes[data.number - 1][1].number : 0
  return [ref, { ...data, number: reset ? 1 : previousNumber + 1 }]
}

function createElements(buttonTemplate: string, popoverTemplate: string) {
  const renderButton = template(buttonTemplate)
  const renderPopover = template(popoverTemplate)

  return ([reference, data]: RefData): FootnoteElements => {
    const id = data.id

    reference.insertAdjacentHTML(
      'beforebegin',
      `<span class="${CLASS_HOST}">${renderButton(data)}</span>`
    )

    const host = reference.previousElementSibling as HTMLElement

    const button = host.firstElementChild as HTMLElement
    button.dataset.footnoteButton = ''
    button.dataset.footnoteId = id
    button.dataset.footnoteNumber = `${data.number}`

    const popover = createElementFromHTML(renderPopover(data))
    popover.dataset.footnotePopover = ''
    popover.dataset.footnoteId = id

    const wrapper = getFirstElementByClass(popover, CLASS_WRAPPER)
    const content = getFirstElementByClass(popover, CLASS_CONTENT)
    bindScrollHandler(content, popover)

    return { id, button, host, popover, content, wrapper }
  }
}

export function setup(settings: Settings): Footnote[] {
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
    .map(prepareTemplateData)
    .map(numberResetSelector ? resetNumbers(numberResetSelector) : i => i)
    .map(createElements(buttonTemplate, contentTemplate))
    .map(createFootnote)
}

export function cleanup(footnotes: Footnote[]): void {
  footnotes.forEach(footnote => footnote.destroy())
  queryAll(document, '.' + CLASS_PRINT_ONLY).forEach(element =>
    element.classList.remove(CLASS_PRINT_ONLY)
  )
}
