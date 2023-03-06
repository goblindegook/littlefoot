import { test, expect, afterEach, beforeEach, vi } from 'vitest'
import { fireEvent } from '@testing-library/dom'
import {
  setDocumentBody,
  waitToStopChanging,
  getPopoverByText,
  getButton,
} from './helper'
import littlefoot from '../src/littlefoot'

const TEST_SETTINGS = { activateDelay: 1 }

beforeEach(() => {
  setDocumentBody('single.html')
})

afterEach(() => {
  vi.useRealTimers()
})

test('activate footnote when clicking the button', async () => {
  littlefoot(TEST_SETTINGS)
  const button = getButton('1')

  fireEvent.click(button)

  expect(button).toHaveClass('is-changing')
  await waitToStopChanging(button)
  expect(button).toHaveClass('is-active')
  const popover = getPopoverByText(/This is the document's only footnote./)
  expect(popover).toHaveClass('is-active')
})

test('does not insert empty paragraphs in the footnote content (#187)', async () => {
  littlefoot(TEST_SETTINGS)
  const button = getButton('1')
  fireEvent.click(button)
  await waitToStopChanging(button)
  expect(document.querySelectorAll('.littlefoot__content p')).toHaveLength(1)
})

test('activate footnote by ID when calling .activate()', () => {
  vi.useFakeTimers()
  const instance = littlefoot({ activateDelay: 200 })
  const button = getButton('1')

  instance.activate('1')

  vi.advanceTimersByTime(50)
  expect(button).toHaveClass('is-changing')

  vi.advanceTimersByTime(50)
  expect(button).toHaveClass('is-active')
  getPopoverByText(/This is the document's only footnote./)
})

test('activate footnote by ID when calling .activate() with a timeout', () => {
  vi.useFakeTimers()
  const instance = littlefoot({ activateDelay: 200 })
  const button = getButton('1')

  instance.activate('1', 100)

  vi.advanceTimersByTime(50)
  expect(button).toHaveClass('is-changing')

  vi.advanceTimersByTime(50)
  expect(button).toHaveClass('is-active')
})

test('activation with unknown ID does not activate any popovers', () => {
  const instance = littlefoot({ activateDelay: 0 })
  instance.activate('invalid')
  expect(document.querySelector('.littlefoot__popover')).toBeNull()
})

test('button and popover state reflected on ARIA properties', async () => {
  littlefoot(TEST_SETTINGS)
  const button = getButton('1')

  fireEvent.click(button)
  await waitToStopChanging(button)

  expect(button).toHaveAttribute('aria-expanded', 'true')
})

test('popup layout dimensions', async () => {
  littlefoot(TEST_SETTINGS)
  const button = getButton('1')

  fireEvent.click(button)

  await waitToStopChanging(button)

  const popover = document.querySelector('.littlefoot__popover')
  expect(popover).toHaveStyle(`max-width: ${document.body.clientWidth}px`)

  const content = document.querySelector('.littlefoot__content')
  expect(content).toHaveProperty('offsetWidth', document.body.clientWidth)
})
