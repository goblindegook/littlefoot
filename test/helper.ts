import { readFileSync } from 'fs'
import { join } from 'path'

export function queryAll(selector: string) {
  return document.querySelectorAll(selector)
}

export function setup(fixture: string): void {
  document.body.innerHTML = readFileSync(join(__dirname, 'fixtures', fixture), {
    encoding: 'utf8'
  })
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

export function queryAllPopovers() {
  return Array.from(document.querySelectorAll('aside[data-footnote-id]'))
}
