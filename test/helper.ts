import '@testing-library/jest-dom/extend-expect'
import { waitFor, screen } from '@testing-library/dom'
import { join } from 'path'
import { readFileSync } from 'fs'

export function queryAll<E extends Element>(selector: string): E[] {
  return Array.from(document.querySelectorAll<E>(selector))
}

export function getPopoverByText(matcher: string | RegExp): HTMLElement {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return screen
    .getByText(matcher, { selector: '.littlefoot-footnote *' })
    .closest<HTMLElement>('[data-footnote-id]')!
}

export function setDocumentBody(fixture: string): void {
  document.body.innerHTML = readFileSync(join(__dirname, 'fixtures', fixture), {
    encoding: 'utf8',
  })
}

export function getButton(id: string): HTMLElement {
  return screen.getByTitle(`See Footnote ${id}`)
}

export function getPopover(id: string): HTMLElement {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return document.querySelector<HTMLElement>(`aside[data-footnote-id="${id}"]`)!
}

export function getAllButtons(): HTMLInputElement[] {
  return queryAll('button[data-footnote-button]')
}

export function getAllActiveButtons(): HTMLInputElement[] {
  return queryAll('button[data-footnote-button].is-active')
}

export async function waitToStartChanging(button: HTMLElement): Promise<void> {
  await waitFor(() => expect(button).toHaveClass('is-changing'), {
    container: button,
  })
}

export async function waitToStopChanging(button: HTMLElement): Promise<void> {
  await waitFor(() => expect(button).not.toHaveClass('is-changing'), {
    container: button,
  })
}
