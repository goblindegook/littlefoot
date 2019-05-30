import { wait, fireEvent } from '@testing-library/dom'
import {
  setDocumentBody,
  waitForChange,
  getPopoverByText,
  getButton
} from './helper'
import littlefoot from '../src'

const TEST_SETTINGS = { activateDelay: 1 }

beforeEach(() => {
  setDocumentBody('single.html')
})

test('activate footnote when clicking the button', async () => {
  littlefoot(TEST_SETTINGS)
  const button = getButton('1')

  fireEvent.click(button)

  expect(button).toHaveClass('is-changing')
  await waitForChange(button)
  expect(button).toHaveClass('is-active')
  getPopoverByText(/This is the document's only footnote./)
})

test('activate footnote by ID when calling .activate()', async () => {
  const instance = littlefoot(TEST_SETTINGS)
  const button = getButton('1')

  instance.activate('1')

  expect(button).toHaveClass('is-changing')
  await waitForChange(button)
  expect(button).toHaveClass('is-active')
  getPopoverByText(/This is the document's only footnote./)
})

test('activation with unknown ID does not activate any popovers', () => {
  const instance = littlefoot({ activateDelay: 0 })
  instance.activate('invalid')
  expect(document.querySelector('.littlefoot-footnote')).toBeNull()
})

test('popup ARIA properties', async () => {
  littlefoot(TEST_SETTINGS)
  const button = getButton('1')

  fireEvent.click(button)

  await waitForChange(button)

  const popover = document.querySelector('.littlefoot-footnote')
  expect(button).toHaveAttribute('aria-controls', popover!.id)
  expect(button).toHaveAttribute('aria-expanded', 'true')
  expect(popover).toHaveAttribute('aria-live', 'polite')
})

test('popup layout dimensions', async () => {
  littlefoot(TEST_SETTINGS)
  const button = getButton('1')

  fireEvent.click(button)

  await waitForChange(button)

  const popover = document.querySelector('.littlefoot-footnote')
  expect(popover).toHaveStyle(`max-width: ${document.body.clientWidth}px`)

  const content = document.querySelector('.littlefoot-footnote__content')
  expect(content).toHaveProperty('offsetWidth', document.body.clientWidth)
})
