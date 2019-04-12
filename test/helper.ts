import 'jest-dom/extend-expect'
import { wait, getByText, getByTitle } from 'dom-testing-library'
import { join } from 'path'
import { readFileSync } from 'fs'

export function queryAll<E extends Element>(selector: string): Array<E> {
  return Array.from(document.querySelectorAll<E>(selector))
}

export function getPopoverByText(matcher: string | RegExp): HTMLElement {
  return getByText(document.body, matcher, {
    selector: '.littlefoot-footnote *'
  })
}

export function setDocumentBody(fixture: string): void {
  document.body.innerHTML = readFileSync(join(__dirname, 'fixtures', fixture), {
    encoding: 'utf8'
  })
}

export function getButton(id: string) {
  return getByTitle(document.body, `See Footnote ${id}`)
}

export function getPopover(id: string) {
  return document.querySelector(`aside[data-footnote-popover-id="${id}"]`)
}

export function getAllButtons() {
  return queryAll('button[data-footnote-button-id]')
}

export function getAllActiveButtons() {
  return queryAll('button[data-footnote-button-id].is-active')
}

export const waitForChange = async (button: Element) =>
  wait(() => expect(button).not.toHaveClass('is-changing'))
