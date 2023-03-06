import { test, expect, beforeEach } from 'vitest'
import { fireEvent, screen } from '@testing-library/dom'
import {
  setDocumentBody,
  waitToStopChanging,
  getPopoverByText,
  getButton,
  getPopover,
} from './helper'
import littlefoot from '../src/littlefoot'

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
    screen.queryByText(/This is the document's only footnote./, {
      selector: '.littlefoot__popover *',
    })
  ).not.toBeInTheDocument()
  expect(button).not.toHaveClass('is-active')
})

test('deactivate popover when dismissing a footnote', async () => {
  littlefoot(TEST_SETTINGS)
  const button = getButton('1')
  fireEvent.click(button)
  await waitToStopChanging(button)
  const popover = getPopover('1')

  fireEvent.click(button)

  expect(popover).not.toHaveClass('is-active')
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

test.each([[{ keyCode: 27 }, { key: 'Escape' }, { key: 'Esc' }]])(
  'dismiss footnote when pressing the Escape key',
  async (options) => {
    littlefoot(TEST_SETTINGS)
    const button = getButton('1')
    fireEvent.click(button)
    await waitToStopChanging(button)

    fireEvent.keyUp(document.body, options)
    await waitToStopChanging(button)

    expect(button).not.toHaveClass('is-active')
  }
)

test('does not dismiss footnote when pressing any other key', async () => {
  littlefoot(TEST_SETTINGS)
  const button = getButton('1')
  fireEvent.click(button)
  await waitToStopChanging(button)

  fireEvent.keyUp(document.body, { keyCode: 26 })

  expect(button).toHaveClass('is-active')
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
