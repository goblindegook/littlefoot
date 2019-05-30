import { fireEvent, queryByText } from '@testing-library/dom'
import {
  setDocumentBody,
  waitForChange,
  getPopoverByText,
  getButton
} from './helper'
import littlefoot from '../src'

const TEST_SETTINGS = { activateDelay: 0, dismissDelay: 0 }

beforeEach(() => {
  setDocumentBody('single.html')
})

test('dismiss footnote when clicking the button again', async () => {
  littlefoot(TEST_SETTINGS)

  const button = getButton('1')
  fireEvent.click(button)
  await waitForChange(button)

  fireEvent.click(button)

  expect(button).toHaveClass('is-changing')
  await waitForChange(button)
  expect(
    queryByText(document.body, /This is the document's only footnote./, {
      selector: '.littlefoot-footnote *'
    })
  ).not.toBeInTheDocument()
  expect(button).not.toHaveClass('is-active')
})

test('dismiss footnote when clicking the document body', async () => {
  littlefoot(TEST_SETTINGS)

  const button = getButton('1')
  fireEvent.click(button)
  await waitForChange(button)

  fireEvent.click(document.body)

  expect(button).toHaveClass('is-changing')
  await waitForChange(button)
  expect(button).not.toHaveClass('is-active')
})

test('do not dismiss footnote when clicking the popover', async () => {
  littlefoot(TEST_SETTINGS)

  const button = getButton('1')
  fireEvent.click(button)
  await waitForChange(button)

  const popover = getPopoverByText(/This is the document's only footnote./)
  fireEvent.click(popover)

  await waitForChange(button)
  expect(popover).toBeInTheDocument()
  expect(button).toHaveClass('is-active')
})

test('dismiss a single footnote by ID when calling .dismiss()', async () => {
  const instance = littlefoot(TEST_SETTINGS)

  const button = getButton('1')
  instance.activate('1')
  await waitForChange(button)

  instance.dismiss('1')

  expect(button).toHaveClass('is-changing')
  await waitForChange(button)
  expect(button).not.toHaveClass('is-active')
})

test('dismiss all footnotes when calling .dismiss()', async () => {
  const instance = littlefoot(TEST_SETTINGS)

  const button = getButton('1')
  instance.activate('1')
  await waitForChange(button)

  instance.dismiss()

  expect(button).toHaveClass('is-changing')
  await waitForChange(button)
  expect(button).not.toHaveClass('is-active')
})

test('dismiss footnote when pressing the Escape key', async () => {
  const KEY_ESCAPE = '27'
  littlefoot(TEST_SETTINGS)

  const button = getButton('1')
  fireEvent.click(button)
  await waitForChange(button)

  fireEvent.keyUp(document.body, { key: KEY_ESCAPE })

  expect(button).toHaveClass('is-changing')
  await waitForChange(button)
  expect(button).not.toHaveClass('is-active')
})

test('set ARIA expanded state to false', async () => {
  littlefoot(TEST_SETTINGS)

  const button = getButton('1')

  fireEvent.click(button)
  await waitForChange(button)
  fireEvent.click(button)
  await waitForChange(button)

  expect(button).toHaveAttribute('aria-expanded', 'false')
})
