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

type RefBody = readonly [HTMLElement, string, HTMLElement]
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

function queryByClass(element: HTMLElement, className: string): HTMLElement {
  return (
    element.querySelector<HTMLElement>('.' + className) ||
    (element.firstElementChild as HTMLElement) ||
    element
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
    const body = related && related.closest<HTMLElement>(footnoteSelector)

    if (body) {
      processed.push(body)
      const parent = link.closest<HTMLElement>(anchorParentSelector)
      const reference = parent || link
      return [reference, reference.id || link.id, body]
    }
  }
}

function hideFootnoteContainer(container: HTMLElement): void {
  const visibleElements = children(container, `:not(.${CLASS_PRINT_ONLY})`)
  const visibleSeparators = visibleElements.filter(el => el.tagName === 'HR')

  if (visibleElements.length === visibleSeparators.length) {
    visibleSeparators.concat(container).forEach(setPrintOnly)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    hideFootnoteContainer(container.parentElement!)
  }
}

function hideOriginalFootnote([reference, refId, body]: RefBody): RefBody {
  setPrintOnly(reference)
  setPrintOnly(body)
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  hideFootnoteContainer(body.parentElement!)
  return [reference, refId, body]
}

function recursiveUnmount(element: HTMLElement) {
  const parent = element.parentElement
  unmount(element)
  const html =
    parent &&
    parent.innerHTML
      .replace('[]', '')
      .replace('&nbsp;', ' ')
      .trim()
  if (parent && !html) {
    recursiveUnmount(parent)
  }
}

function prepareTemplateData(
  [reference, referenceId, body]: RefBody,
  idx: number
): RefData {
  const content = body.cloneNode(true) as HTMLElement
  queryAll<HTMLElement>(content, '[href$="#' + referenceId + '"]').forEach(
    recursiveUnmount
  )

  const data: TemplateData = {
    id: `${idx + 1}`,
    number: idx + 1,
    reference: referenceId,
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

function interpolate(template: string) {
  const pattern = /<%=?\s*(\w+?)\s*%>/g
  return (replacement: TemplateData) =>
    template.replace(pattern, (_, key: keyof TemplateData) =>
      replacement[key] !== undefined ? String(replacement[key]) : ''
    )
}

function createElements(buttonTemplate: string, popoverTemplate: string) {
  const renderButton = interpolate(buttonTemplate)
  const renderPopover = interpolate(popoverTemplate)

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

    const wrapper = queryByClass(popover, CLASS_WRAPPER)
    const content = queryByClass(popover, CLASS_CONTENT)
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
