import 'jest-dom/extend-expect'
import { wait, fireEvent } from 'dom-testing-library'
import littlefoot from '../src'
import {
  setup,
  getButton,
  queryAllButtons,
  queryAllActiveButtons,
  queryAll
} from './helper'

beforeEach(() => {
  setup('default.html')
})

test('creates one button and one container per footnote call', () => {
  littlefoot()
  expect(queryAll('.littlefoot-footnote__container')).toHaveLength(4)
  expect(queryAllButtons()).toHaveLength(4)
})

test('processes each called footnote', () => {
  littlefoot()
  expect(queryAll('.footnote-processed')).toHaveLength(3)
  expect(queryAll('.footnotes')).toHaveLength(1)
})

test('hides all footnotes', () => {
  littlefoot()
  expect(queryAll('.footnotes.footnote-print-only')).toHaveLength(1)
  expect(queryAll('hr.footnote-print-only')).toHaveLength(1)
  expect(queryAll('li.footnote-print-only')).toHaveLength(3)
})

test('starts with no active footnotes', () => {
  littlefoot()
  expect(queryAllActiveButtons()).toHaveLength(0)
})

test('sets ARIA attributes on button', () => {
  littlefoot()
  const button = getButton('1')
  expect(button).toHaveAttribute('aria-expanded', 'false')
  expect(button).toHaveAttribute('aria-label', 'Footnote 1')
})

test('activate footnote with .activate()', async () => {
  const lf = littlefoot({ activateDelay: 10 })
  const button = getButton('1')

  lf.activate('button[data-footnote-id="1"]')
  expect(button).toHaveClass('is-changing')
  await wait(() => expect(button).not.toHaveClass('is-changing'))

  const popover = document.querySelector<HTMLElement>('.littlefoot-footnote')!
  const content = document.querySelector<HTMLElement>(
    '.littlefoot-footnote__content'
  )!

  expect(button).toHaveClass('is-active')
  expect(button).toHaveAttribute('aria-expanded', 'true')
  expect(button).toHaveAttribute('aria-controls', popover.id)

  expect(content).toContainHTML(button.getAttribute('data-footnote-content')!)
  expect(content.offsetWidth).toBe(document.body.clientWidth)

  expect(popover).toHaveAttribute('data-footnote-max-height', '0')
  expect(popover).toHaveStyle(`max-width: ${document.body.clientWidth}px`)
})

test('dismiss footnote with .dismiss()', async () => {
  const lf = littlefoot({ activateDelay: 10, dismissDelay: 10 })
  const button = getButton('1')

  lf.activate('button[data-footnote-id="1"]')
  await wait(() => expect(button).not.toHaveClass('is-changing'))

  lf.dismiss()
  expect(button).toHaveClass('is-changing')
  await wait(() => expect(button).not.toHaveClass('is-changing'))
  await wait(() => expect(button).not.toHaveClass('is-active'))
})

test('activate footnote on clicking the button', async () => {
  littlefoot({ activateDelay: 10 })
  const button = getButton('1')

  fireEvent.click(button)
  expect(button).toHaveClass('is-changing')
  await wait(() => expect(button).not.toHaveClass('is-changing'))
  await wait(() => expect(button).toHaveClass('is-active'))
})

test('dismiss footnote on clicking the button again', async () => {
  littlefoot({ activateDelay: 10, dismissDelay: 10 })
  const button = getButton('1')

  fireEvent.click(button)
  await wait(() => expect(button).not.toHaveClass('is-changing'))

  fireEvent.click(button)
  expect(button).toHaveClass('is-changing')
  await wait(() => expect(button).not.toHaveClass('is-changing'))
  await wait(() => expect(button).not.toHaveClass('is-active'))
})

test('dismiss footnote on clicking the document body', async () => {
  littlefoot({ activateDelay: 10, dismissDelay: 10 })
  const button = getButton('1')

  fireEvent.click(button)
  await wait(() => expect(button).not.toHaveClass('is-changing'))

  fireEvent.click(document.body)
  expect(button).toHaveClass('is-changing')
  await wait(() => expect(button).not.toHaveClass('is-changing'))
  await wait(() => expect(button).not.toHaveClass('is-active'))
})

test('activation with invalid selector does not activate any popovers', () => {
  const lf = littlefoot({ activateDelay: 0 })
  lf.activate('invalid')
  expect(document.querySelector('.littlefoot-footnote')).toBeNull()
})
