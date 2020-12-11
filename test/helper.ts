import '@testing-library/jest-dom/extend-expect'
import { waitFor, screen } from '@testing-library/dom'
import { join } from 'path'
import { readFileSync } from 'fs'

export function getPopoverByText(matcher: string | RegExp): HTMLElement {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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

export async function waitToStartChanging(button: HTMLElement): Promise<void> {
  await waitFor(() => expect(button).toHaveClass('is-changing'))
}

export async function waitToStopChanging(button: HTMLElement): Promise<void> {
  await waitFor(() => expect(button).not.toHaveClass('is-changing'))
}
