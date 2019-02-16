import 'jest-dom/extend-expect'
import { fireEvent } from 'dom-testing-library'
import littlefoot from '../src'
import { setup, waitForTransition, getButton } from './helper'

const TEST_SETTINGS = { activateDelay: 1, dismissDelay: 1 }

beforeEach(() => {
  setup('default.html')
})

test('dismiss footnote when clicking the button again', async () => {
  littlefoot(TEST_SETTINGS)
  const button = getButton('1')
  fireEvent.click(button)
  await waitForTransition(button)

  fireEvent.click(button)

  expect(button).toHaveClass('is-changing')
  await waitForTransition(button)
  expect(button).not.toHaveClass('is-active')
})

test('dismiss footnote when clicking the document body', async () => {
  littlefoot(TEST_SETTINGS)
  const button = getButton('1')
  fireEvent.click(button)
  await waitForTransition(button)

  fireEvent.click(document.body)

  expect(button).toHaveClass('is-changing')
  await waitForTransition(button)
  expect(button).not.toHaveClass('is-active')
})

test('dismiss footnote when calling .dismiss()', async () => {
  const instance = littlefoot(TEST_SETTINGS)
  const button = getButton('1')
  instance.activate('button[data-footnote-id="1"]')
  await waitForTransition(button)

  instance.dismiss()

  expect(button).toHaveClass('is-changing')
  await waitForTransition(button)
  expect(button).not.toHaveClass('is-active')
})

test('dismiss footnote when pressing the Escape key', async () => {
  const KEY_ESCAPE = '27'
  littlefoot(TEST_SETTINGS)
  const button = getButton('1')
  fireEvent.click(button)
  await waitForTransition(button)

  fireEvent.keyUp(document.body, { key: KEY_ESCAPE })

  expect(button).toHaveClass('is-changing')
  await waitForTransition(button)
  expect(button).not.toHaveClass('is-active')
})
