export function children(element: Element, selector?: string): Element[] {
  return Array.from(element.children).filter(
    child => child.nodeType !== 8 && (!selector || child.matches(selector))
  )
}

export function getStyle(
  element: Element,
  property: keyof CSSStyleDeclaration
): string {
  const view =
    (element.ownerDocument && element.ownerDocument.defaultView) || window
  const style = view.getComputedStyle(element)
  return style.getPropertyValue(property as string) || style[property] || ''
}

export function getMaxHeight(element: HTMLElement): number {
  const maxHeight = getStyle(element, 'maxHeight')
  if (maxHeight === '' || maxHeight === 'none') {
    return element.clientHeight
  }

  const size = parseFloat(maxHeight)

  return /%/.test(maxHeight)
    ? Math.round((size / 100) * document.body.clientHeight)
    : Math.round(size)
}
