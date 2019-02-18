export function children(element: Element, selector?: string): Element[] {
  return Array.from(element.children).filter(
    child => child.nodeType !== 8 && (!selector || child.matches(selector))
  )
}

export function findSibling(
  target: Element,
  selector: string
): HTMLElement | undefined {
  return children(target.parentElement!, selector).find(
    element => element !== target
  ) as HTMLElement | undefined
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
  const size = parseFloat(maxHeight)

  if (maxHeight === '' || maxHeight === 'none') {
    return element.clientHeight
  }

  if (/%/.test(maxHeight)) {
    return Math.round((size / 100) * document.body.clientHeight)
  }

  return Math.round(size)
}
