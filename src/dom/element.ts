export function addClass(element: Element, className: string): void {
  element.classList.add(className)
}

export function removeClass(element: Element, className: string): void {
  element.classList.remove(className)
}

export function hasClass(element: Element, className: string): boolean {
  return element.classList.contains(className)
}
