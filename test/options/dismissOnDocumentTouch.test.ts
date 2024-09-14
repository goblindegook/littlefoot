import { fireEvent } from '@testing-library/dom'
import { expect, test } from 'vitest'
import littlefoot from '../../src/littlefoot'
import {
  getAllActiveButtons,
  getButton,
  getPopover,
  setDocumentBody,
  waitToStopChanging,
} from '../helper'

test('do not dismiss footnote when clicking the document body', async () => {
  setDocumentBody('single.html')
  littlefoot({
    dismissOnDocumentTouch: false,
    activateDelay: 0,
    dismissDelay: 0,
  })

  const button = getButton('1')
  fireEvent.click(button)
  await waitToStopChanging(button)
  const popover = getPopover('1')

  fireEvent.click(document.body)

  expect(popover).toBeInTheDocument()
  expect(button).toHaveClass('is-active')
})

test('dismiss footnote when clicking the button again', async () => {
  setDocumentBody('single.html')
  littlefoot({
    dismissOnDocumentTouch: false,
    activateDelay: 0,
    dismissDelay: 0,
  })
  const button = getButton('1')
  fireEvent.click(button)
  await waitToStopChanging(button)

  fireEvent.click(button)

  expect(button).toHaveClass('is-changing')
  await waitToStopChanging(button)
  const popover = getPopover('1')
  expect(popover).not.toBeInTheDocument()
  expect(button).not.toHaveClass('is-active')
})

test('disallow multiple activations', async () => {
  setDocumentBody('default.html')
  littlefoot({
    dismissOnDocumentTouch: false,
    activateDelay: 0,
    dismissDelay: 0,
  })

  const one = getButton('1')
  fireEvent.click(one)
  await waitToStopChanging(one)

  const two = getButton('2')
  fireEvent.click(two)
  await waitToStopChanging(two)

  expect(getAllActiveButtons()).toEqual([two])
})
