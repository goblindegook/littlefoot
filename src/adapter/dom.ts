export function findSibling(
  target: Element,
  selector: string
): HTMLElement | undefined {
  return Array.from(target.parentElement!.children).find(
    element => element !== target && element.matches(selector)
  ) as HTMLElement | undefined
}

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
  const value = getStyle(element, 'maxHeight')
  const size = parseFloat(value)

  if (value === '' || value === 'none') {
    return element.clientHeight
  }

  if (/%/.test(value)) {
    return Math.round((size / 100) * document.body.clientHeight)
  }

  return Math.round(size)
}
