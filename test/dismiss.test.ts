import { fireEvent, queryByText } from '@testing-library/dom'
import {
  setDocumentBody,
  waitToStopChanging,
  getPopoverByText,
  getButton,
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
  await waitToStopChanging(button)

  fireEvent.click(button)

  expect(button).toHaveClass('is-changing')
  await waitToStopChanging(button)
  expect(
    queryByText(document.body, /This is the document's only footnote./, {
      selector: '.littlefoot-footnote *',
    })
  ).not.toBeInTheDocument()
  expect(button).not.toHaveClass('is-active')
})

test('dismiss footnote when clicking the document body', async () => {
  littlefoot(TEST_SETTINGS)

  const button = getButton('1')
  fireEvent.click(button)
  await waitToStopChanging(button)

  fireEvent.click(document.body)

  expect(button).toHaveClass('is-changing')
  await waitToStopChanging(button)
  expect(button).not.toHaveClass('is-active')
})

test('do not dismiss footnote when clicking the popover', async () => {
  littlefoot(TEST_SETTINGS)

  const button = getButton('1')
  fireEvent.click(button)
  await waitToStopChanging(button)

  const popover = getPopoverByText(/This is the document's only footnote./)
  fireEvent.click(popover)

  await waitToStopChanging(button)
  expect(popover).toBeInTheDocument()
  expect(button).toHaveClass('is-active')
})

test('dismiss a single footnote by ID when calling .dismiss()', async () => {
  const instance = littlefoot(TEST_SETTINGS)

  const button = getButton('1')
  instance.activate('1')
  await waitToStopChanging(button)

  instance.dismiss('1')

  expect(button).toHaveClass('is-changing')
  await waitToStopChanging(button)
  expect(button).not.toHaveClass('is-active')
})

test('dismiss all footnotes when calling .dismiss()', async () => {
  const instance = littlefoot(TEST_SETTINGS)

  const button = getButton('1')
  instance.activate('1')
  await waitToStopChanging(button)

  instance.dismiss()

  expect(button).toHaveClass('is-changing')
  await waitToStopChanging(button)
  expect(button).not.toHaveClass('is-active')
})

test('dismiss footnote when pressing the Escape key', async () => {
  littlefoot(TEST_SETTINGS)

  const button = getButton('1')
  fireEvent.click(button)
  await waitToStopChanging(button)

  fireEvent.keyUp(document.body, { keyCode: 27 })
  await waitToStopChanging(button)

  expect(button).not.toHaveClass('is-active')
})

test('set ARIA expanded state to false', async () => {
  littlefoot(TEST_SETTINGS)

  const button = getButton('1')

  fireEvent.click(button)
  await waitToStopChanging(button)
  fireEvent.click(button)
  await waitToStopChanging(button)

  expect(button).toHaveAttribute('aria-expanded', 'false')
})
