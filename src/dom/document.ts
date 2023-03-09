import { createFootnote, FootnoteElements } from './footnote'
import { bindScrollHandler } from './scroll'
import { Adapter } from '../use-cases'
import { addClass, removeClass, unmount } from './element'

export const CLASS_CONTENT = 'littlefoot__content'
export const CLASS_WRAPPER = 'littlefoot__wrapper'

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

const CLASS_PRINT_ONLY = 'littlefoot--print'
const CLASS_HOST = 'littlefoot'

const setPrintOnly = (el: Element) => addClass(el, CLASS_PRINT_ONLY)

function queryAll<E extends Element>(
  parent: ParentNode,
  selector: string
): readonly E[] {
  return Array.from(parent.querySelectorAll<E>(selector))
}

function getByClassName<E extends Element>(element: E, className: string): E {
  return (
    element.querySelector<E>('.' + className) ||
    (element.firstElementChild as E | null) ||
    element
  )
}

function createElementFromHTML(html: string): HTMLElement {
  const container = document.createElement('div')
  container.innerHTML = html
  return container.firstElementChild as HTMLElement
}

function children(element: Element, selector: string): readonly Element[] {
  return Array.from(element.children).filter(
    (child) => child.nodeType !== 8 && child.matches(selector)
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
  return queryAll<HTMLAnchorElement>(document, scope + ' a[href*="#"]').filter(
    (link) => (link.href + link.rel).match(pattern)
  )
}

function findReference(
  document: Document,
  allowDuplicates: boolean,
  anchorParentSelector: string,
  footnoteSelector: string
) {
  const processed: Element[] = []
  return (link: HTMLAnchorElement): Original | undefined => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const fragment = link.href.split('#')[1]!
    const related = queryAll(document, '#' + window.CSS.escape(fragment)).find(
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

function recursiveHideFootnoteContainer(element: HTMLElement): void {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const container = element.parentElement!
  const visibleElements = children(container, ':not(.' + CLASS_PRINT_ONLY + ')')
  const visibleSeparators = visibleElements.filter((el) => el.tagName === 'HR')

  if (visibleElements.length === visibleSeparators.length) {
    visibleSeparators.concat(container).forEach(setPrintOnly)
    recursiveHideFootnoteContainer(container)
  }
}

function recursiveUnmount(element: HTMLElement) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const parent = element.parentElement!
  unmount(element)
  const html = parent.innerHTML.replace('[]', '').replace('&nbsp;', ' ').trim()

  if (!html) {
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
      id: String(idx + 1),
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
    button.setAttribute('aria-expanded', 'false')
    button.dataset.footnoteButton = ''
    button.dataset.footnoteId = id

    const popover = createElementFromHTML(renderPopover(data))
    popover.dataset.footnotePopover = ''
    popover.dataset.footnoteId = id

    const wrapper = getByClassName(popover, CLASS_WRAPPER)
    const content = getByClassName(popover, CLASS_CONTENT)
    bindScrollHandler(content, popover)

    return { original, data, id, button, host, popover, content, wrapper }
  }
}

export function setup({
  allowDuplicates,
  anchorParentSelector,
  anchorPattern,
  buttonTemplate,
  contentTemplate,
  footnoteSelector,
  numberResetSelector,
  scope,
}: HTMLAdapterSettings): Adapter<HTMLElement> {
  const footnotes = findFootnoteLinks(document, anchorPattern, scope)
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
    .map((e) => {
      setPrintOnly(e.original.reference)
      setPrintOnly(e.original.body)
      recursiveHideFootnoteContainer(e.original.body)
      e.original.reference.insertAdjacentElement('beforebegin', e.host)
      return e
    })
    .map(createFootnote)

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
