import type { Footnote } from '../use-cases'
import { addClass, removeClass } from './element'
import { createFootnote, type FootnoteElements } from './footnote'
import { bindScrollHandler } from './scroll'

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

type TemplateValues = Readonly<{
  number: number
  id: string
  content: string
  reference: string
}>

const CLASS_PRINT_ONLY = 'littlefoot--print'

const setAllPrintOnly = (...elements: readonly Element[]) =>
  elements.forEach((e) => {
    addClass(e, CLASS_PRINT_ONLY)
  })

function queryAll<E extends Element>(parent: ParentNode, selector: string): readonly E[] {
  return Array.from(parent.querySelectorAll<E>(selector))
}

function getByClassName<E extends Element>(element: E, className: string): E {
  return (
    element.querySelector<E>('.' + className) || (element.firstElementChild as E | null) || element
  )
}

function createElementFromHTML(html: string): HTMLElement {
  const container = document.createElement('div')
  container.innerHTML = html
  const element = container.firstElementChild as HTMLElement
  element.remove()
  return element
}

function isDefined<T>(value?: T): value is T {
  return value !== undefined
}

function findFootnoteLinks(
  document: Document,
  pattern: RegExp,
  scope: string,
): readonly HTMLAnchorElement[] {
  return queryAll<HTMLAnchorElement>(document, scope + ' a[href*="#"]').filter((link) =>
    (link.href + link.rel).match(pattern),
  )
}

function findReference<E extends Element>(
  document: Document,
  allowDuplicates: boolean,
  anchorParentSelector: string,
  footnoteSelector: string,
) {
  const processed: E[] = []
  return (link: HTMLAnchorElement): [string, Element, E] | undefined => {
    const fragment = link.href.split('#')[1]
    if (!fragment) return

    const body = queryAll<E>(document, '#' + window.CSS.escape(fragment))
      .find((footnote) => allowDuplicates || !processed.includes(footnote))
      ?.closest<E>(footnoteSelector)
    if (!body) return

    processed.push(body)
    const reference = link.closest<E>(anchorParentSelector) || link
    return [reference.id || link.id, reference, body]
  }
}

function recursiveHideFootnoteContainer(element: Element): void {
  // biome-ignore lint/style/noNonNullAssertion: never null
  const container = element.parentElement!
  const visibleElements = queryAll(container, ':scope > :not(.' + CLASS_PRINT_ONLY + ')')
  const visibleSeparators = visibleElements.filter((el) => el.tagName === 'HR')

  if (visibleElements.length === visibleSeparators.length) {
    setAllPrintOnly(...visibleSeparators.concat(container))
    recursiveHideFootnoteContainer(container)
  }
}

function recursiveUnmount(element: Element, stopElement: Element) {
  const parent = element.parentElement
  element.remove()
  if (parent && parent !== stopElement && !parent.innerHTML.replace(/(\[\]|&nbsp;|\s)/g, '')) {
    recursiveUnmount(parent, stopElement)
  }
}

function prepareTemplateData<E extends Element>(
  [id, reference, body]: [string, E, E],
  index: number,
): [E, E, TemplateValues] {
  const content = createElementFromHTML(body.outerHTML)
  const backlinkSelector = '[href$="#' + id + '"]'
  queryAll<E>(content, backlinkSelector).forEach((bl) => {
    recursiveUnmount(bl, content)
  })
  const html = content.innerHTML.trim()

  return [
    reference,
    body,
    {
      id: String(index + 1),
      number: index + 1,
      reference: 'lf-' + id,
      content: html.startsWith('<') ? html : '<p>' + html + '</p>',
    },
  ]
}

function resetNumbers<E extends Element>(resetSelector: string) {
  let number = 0
  let previousParent: E | null = null
  return ([reference, body, values]: [E, E, TemplateValues]): [E, E, TemplateValues] => {
    const parent = reference.closest<E>(resetSelector)
    number = previousParent === parent ? number + 1 : 1
    previousParent = parent
    return [reference, body, { ...values, number }]
  }
}

function interpolate(template: string) {
  return (replacement: TemplateValues) =>
    template.replace(/<%=?\s*(\w+?)\s*%>/g, (_, key: keyof TemplateValues) =>
      String(replacement[key] ?? ''),
    )
}

function renderElements<E extends Element>(buttonTemplate: string, popoverTemplate: string) {
  const renderButton = interpolate(buttonTemplate)
  const renderPopover = interpolate(popoverTemplate)

  return ([reference, values]: [E, TemplateValues]): FootnoteElements => {
    const id = values.id

    const host = createElementFromHTML(
      '<span class="littlefoot">' + renderButton(values) + '</span>',
    )

    const button = host.firstElementChild as HTMLElement
    button.setAttribute('aria-expanded', 'false')
    button.dataset.footnoteButton = ''
    button.dataset.footnoteId = id

    const popover = createElementFromHTML(renderPopover(values))
    popover.dataset.footnotePopover = ''
    popover.dataset.footnoteId = id

    const wrapper = getByClassName(popover, CLASS_WRAPPER)
    const content = getByClassName(popover, CLASS_CONTENT)
    bindScrollHandler(content, popover)

    reference.insertAdjacentElement('beforebegin', host)

    return { id, button, host, popover, content, wrapper }
  }
}

export function setup(settings: HTMLAdapterSettings): readonly Footnote<HTMLElement>[] {
  return findFootnoteLinks(document, settings.anchorPattern, settings.scope)
    .map(
      findReference(
        document,
        settings.allowDuplicates,
        settings.anchorParentSelector,
        settings.footnoteSelector,
      ),
    )
    .filter(isDefined)
    .map(prepareTemplateData)
    .map(settings.numberResetSelector ? resetNumbers(settings.numberResetSelector) : (i) => i)
    .map<[Element, TemplateValues]>(([reference, body, values]) => {
      setAllPrintOnly(reference, body)
      recursiveHideFootnoteContainer(body)
      return [reference, values]
    })
    .map(renderElements(settings.buttonTemplate, settings.contentTemplate))
    .map(createFootnote)
}

export function reset(): void {
  queryAll(document, '.' + CLASS_PRINT_ONLY).forEach((element) => {
    removeClass(element, CLASS_PRINT_ONLY)
  })
}
