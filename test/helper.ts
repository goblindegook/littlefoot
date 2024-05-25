import { expect } from 'vitest'
import { waitFor, screen } from '@testing-library/dom'
import { join } from 'node:path'
import { readFileSync } from 'node:fs'
import * as matchers from '@testing-library/jest-dom/matchers'

expect.extend(matchers)

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

export function getButton(id: string): HTMLElement {
  return screen.getByRole('button', { name: `See Footnote ${id}` })
}

export function getPopover(id: string): HTMLElement {
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  return document.querySelector<HTMLElement>(`aside[data-footnote-id="${id}"]`)!
}

export function getAllButtons(): HTMLElement[] {
  return screen.getAllByRole('button', { name: /See Footnote/ })
}

export function getAllActiveButtons(): HTMLElement[] {
  return screen.queryAllByRole('button', {
    name: /See Footnote/,
    expanded: true,
  })
}

export async function waitToStopChanging(button: HTMLElement): Promise<void> {
  expect(button).toHaveClass('is-changing')
  await waitFor(() => expect(button).not.toHaveClass('is-changing'))
}
