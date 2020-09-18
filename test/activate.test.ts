import { fireEvent } from '@testing-library/dom'
import {
  setDocumentBody,
  waitToStopChanging,
  getPopoverByText,
  getButton,
} from './helper'
import littlefoot from '../src'

const TEST_SETTINGS = { activateDelay: 1 }

beforeEach(() => {
  setDocumentBody('single.html')
})

afterEach(jest.useRealTimers)

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
  const paragraphs = document.querySelectorAll(
    '.littlefoot-footnote__content p'
  )
  expect(paragraphs).toHaveLength(1)
})

test('activate footnote by ID when calling .activate()', () => {
  jest.useFakeTimers()
  const instance = littlefoot({ activateDelay: 200 })
  const button = getButton('1')

  instance.activate('1')

  jest.advanceTimersByTime(50)
  expect(button).toHaveClass('is-changing')

  jest.advanceTimersByTime(50)
  expect(button).toHaveClass('is-active')
  getPopoverByText(/This is the document's only footnote./)
})

test('activate footnote by ID when calling .activate() with a timeout', () => {
  jest.useFakeTimers()
  const instance = littlefoot({ activateDelay: 200 })
  const button = getButton('1')

  instance.activate('1', 100)

  jest.advanceTimersByTime(50)
  expect(button).toHaveClass('is-changing')

  jest.advanceTimersByTime(50)
  expect(button).toHaveClass('is-active')
})

test('activation with unknown ID does not activate any popovers', () => {
  const instance = littlefoot({ activateDelay: 0 })
  instance.activate('invalid')
  expect(document.querySelector('.littlefoot-footnote')).toBeNull()
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

  const popover = document.querySelector('.littlefoot-footnote')
  expect(popover).toHaveStyle(`max-width: ${document.body.clientWidth}px`)

  const content = document.querySelector('.littlefoot-footnote__content')
  expect(content).toHaveProperty('offsetWidth', document.body.clientWidth)
})
