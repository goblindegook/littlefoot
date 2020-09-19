export function addClass(element: Element, className: string): void {
  element.classList.add(className)
}

export function removeClass(element: Element, className: string): void {
  element.classList.remove(className)
}

export function unmount(element: HTMLElement): void {
  // eslint-disable-next-line no-unused-expressions
  element.parentNode?.removeChild(element)
}
