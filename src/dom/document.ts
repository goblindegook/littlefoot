import { createFootnote, FootnoteElements } from './footnote'
import { bindScrollHandler } from './scroll'
import { Adapter } from '../core'
import { addClass, removeClass, unmount } from './api'

export const CLASS_CONTENT = 'littlefoot-footnote__content'
export const CLASS_WRAPPER = 'littlefoot-footnote__wrapper'

export type HTMLAdapterSettings = Readonly<{
  allowDuplicates: boolean
  anchorParentSelector: string
  anchorPattern: RegExp
  buttonTemplate: string
  contentTemplate: string
  footnoteSelector: string
  numberResetSelector: string
  scope: string
}>

type TemplateData = Readonly<{
  number: number
  id: string
  content: string
  reference: string
}>

type Original = Readonly<{
  reference: HTMLElement
  referenceId: string
  body: HTMLElement
}>

type OriginalData = Readonly<{
  original: Original
  data: TemplateData
}>

const CLASS_PRINT_ONLY = 'footnote-print-only'
const CLASS_HOST = 'littlefoot-footnote__host'

const setPrintOnly = (el: Element) => addClass(el, CLASS_PRINT_ONLY)

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
    (child) => child.nodeType !== 8 && (!selector || child.matches(selector))
  )
}

function isDefined<T>(value?: T): value is T {
  return value !== undefined
}

function findFootnoteLinks(
  document: Document,
  pattern: RegExp,
  scope: string
): readonly HTMLAnchorElement[] {
  return queryAll<HTMLAnchorElement>(
    document,
    scope + ' a[href*="#"]'
  ).filter((link) => (link.href + link.rel).match(pattern))
}

function findReference(
  document: Document,
  allowDuplicates: boolean,
  anchorParentSelector: string,
  footnoteSelector: string
) {
  const processed: Element[] = []
  return (link: HTMLAnchorElement): Original | undefined => {
    const fragment = link.href.split('#')[1]
    const selector = '#' + fragment.replace(/[:.+~*[\]]/g, '\\$&')
    const related = queryAll(document, selector).find(
      (footnote) => allowDuplicates || !processed.includes(footnote)
    )

    const body = related?.closest<HTMLElement>(footnoteSelector)

    if (body) {
      processed.push(body)
      const reference = link.closest<HTMLElement>(anchorParentSelector) || link
      const referenceId = reference.id || link.id
      return { reference, referenceId, body }
    }
  }
}

function recursiveHideFootnoteContainer(container: HTMLElement): void {
  const visibleElements = children(container, `:not(.${CLASS_PRINT_ONLY})`)
  const visibleSeparators = visibleElements.filter((el) => el.tagName === 'HR')

  if (visibleElements.length === visibleSeparators.length) {
    visibleSeparators.concat(container).forEach(setPrintOnly)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    recursiveHideFootnoteContainer(container.parentElement!)
  }
}

function recursiveUnmount(element: HTMLElement) {
  const parent = element.parentElement
  unmount(element)
  const html = parent?.innerHTML.replace('[]', '').replace('&nbsp;', ' ').trim()

  if (parent && !html) {
    recursiveUnmount(parent)
  }
}

function prepareTemplateData(original: Original, idx: number): OriginalData {
  const content = createElementFromHTML(original.body.outerHTML)
  const backlinkSelector = '[href$="#' + original.referenceId + '"]'
  queryAll<HTMLElement>(content, backlinkSelector).forEach(recursiveUnmount)
  const html = content.innerHTML.trim()

  return {
    original,
    data: {
      id: `${idx + 1}`,
      number: idx + 1,
      reference: 'lf-' + original.referenceId,
      content: html.startsWith('<') ? html : '<p>' + html + '</p>',
    },
  }
}

const resetNumbers = (resetSelector: string) => {
  let current = 0
  let previousParent: Element | null = null
  return ({ original, data }: OriginalData): OriginalData => {
    const parent = original.reference.closest(resetSelector)
    current = previousParent === parent ? current + 1 : 1
    previousParent = parent
    return { original, data: { ...data, number: current } }
  }
}

function interpolate(template: string) {
  const pattern = /<%=?\s*(\w+?)\s*%>/g
  return (replacement: TemplateData) =>
    template.replace(pattern, (_, key: keyof TemplateData) =>
      String(replacement[key] ?? '')
    )
}

function createElements(buttonTemplate: string, popoverTemplate: string) {
  const renderButton = interpolate(buttonTemplate)
  const renderPopover = interpolate(popoverTemplate)

  return ({
    original,
    data,
  }: OriginalData): OriginalData & FootnoteElements => {
    const id = data.id

    const host = createElementFromHTML(
      `<span class="${CLASS_HOST}">${renderButton(data)}</span>`
    )

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

    return { original, data, id, button, host, popover, content, wrapper }
  }
}

function attachFootnote(reference: HTMLElement, host: HTMLElement): void {
  reference.insertAdjacentElement('beforebegin', host)
}

export function setup(settings: HTMLAdapterSettings): Adapter<HTMLElement> {
  const {
    allowDuplicates,
    anchorParentSelector,
    anchorPattern,
    buttonTemplate,
    contentTemplate,
    footnoteSelector,
    numberResetSelector,
    scope,
  } = settings

  const footnoteElements = findFootnoteLinks(document, anchorPattern, scope)
    .map(
      findReference(
        document,
        allowDuplicates,
        anchorParentSelector,
        footnoteSelector
      )
    )
    .filter(isDefined)
    .map(prepareTemplateData)
    .map(numberResetSelector ? resetNumbers(numberResetSelector) : (i) => i)
    .map(createElements(buttonTemplate, contentTemplate))

  footnoteElements.forEach(({ original, host }) => {
    setPrintOnly(original.reference)
    setPrintOnly(original.body)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    recursiveHideFootnoteContainer(original.body.parentElement!)
    attachFootnote(original.reference, host)
  })

  const footnotes = footnoteElements.map(createFootnote)

  return {
    footnotes,

    unmount() {
      footnotes.forEach((footnote) => footnote.destroy())
      queryAll(document, '.' + CLASS_PRINT_ONLY).forEach((element) =>
        removeClass(element, CLASS_PRINT_ONLY)
      )
    },
  }
}
