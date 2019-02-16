import 'jest-dom/extend-expect'
import { wait } from 'dom-testing-library'
import { join } from 'path'
import { readFileSync } from 'fs'

export function queryAll(selector: string) {
  return document.querySelectorAll(selector)
}

export function getFixture(fixture: string): string {
  return readFileSync(join(__dirname, 'fixtures', fixture), {
    encoding: 'utf8'
  })
}

export function setup(fixture: string): void {
  document.body.innerHTML = getFixture(fixture)
}

export function getButton(id: string) {
  return document.querySelector(`button[data-footnote-id="${id}"]`)!
}

export function getPopover(id: string) {
  return document.querySelector(`aside[data-footnote-id="${id}"]`)!
}

export function queryAllButtons() {
  return Array.from(document.querySelectorAll('button[data-footnote-id]'))
}

export function queryAllActiveButtons() {
  return Array.from(
    document.querySelectorAll('button[data-footnote-id].is-active')
  )
}

export const waitForTransition = async (button: Element) =>
  wait(() => expect(button).not.toHaveClass('is-changing'))
