import '@testing-library/jest-dom/vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { screen, waitFor } from '@testing-library/dom'
import { expect } from 'vitest'

export function getPopoverByText(matcher: string | RegExp): HTMLElement {
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  return screen
    .getByText(matcher, { selector: '.littlefoot__popover *' })
    .closest<HTMLElement>('[data-footnote-id]')!
}

export function setDocumentBody(fixture: string): void {
  document.body.innerHTML = readFileSync(join(__dirname, 'fixtures', fixture), {
    encoding: 'utf8',
  })
}

export function getButton(id: string, index = 0): HTMLElement {
  return screen.getAllByRole('button', { name: `Footnote ${id}` })[index]
}

export function getPopover(id: string): HTMLElement {
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  return document.querySelector<HTMLElement>(`aside[data-footnote-id="${id}"]`)!
}

export function getAllButtons(): HTMLElement[] {
  return screen.getAllByRole('button')
}

export function getAllActiveButtons(): HTMLElement[] {
  return screen.queryAllByRole('button', { expanded: true })
}

export async function waitToStopChanging(button: HTMLElement): Promise<void> {
  expect(button).toHaveClass('is-changing')
  await waitFor(() => expect(button).not.toHaveClass('is-changing'))
}
