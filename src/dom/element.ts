export function addClass(element: Element, className: string): void {
  element.classList.add(className)
}

export function removeClass(element: Element, className: string): void {
  element.classList.remove(className)
}

export function unmount(element: Element): void {
  element.parentNode?.removeChild(element)
}
