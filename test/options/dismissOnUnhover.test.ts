import { fireEvent } from '@testing-library/dom'
import {
  setDocumentBody,
  waitForChange,
  getButton,
  getPopover,
} from '../helper'
import littlefoot from '../../src'

test('dismiss on button unhover', async () => {
  setDocumentBody('single.html')

  littlefoot({
    activateDelay: 1,
    activateOnHover: true,
    dismissDelay: 1,
    dismissOnUnhover: true,
    hoverDelay: 1,
  })

  const button = getButton('1')

  fireEvent.mouseOver(button)
  await waitForChange(button)

  fireEvent.mouseOut(button)
  await waitForChange(button)

  expect(button).not.toHaveClass('is-active')
})

test('dismiss on popover unhover', async () => {
  setDocumentBody('single.html')

  littlefoot({
    activateDelay: 1,
    activateOnHover: true,
    dismissDelay: 1,
    dismissOnUnhover: true,
    hoverDelay: 1,
  })

  const button = getButton('1')

  fireEvent.mouseOver(button)
  await waitForChange(button)

  const popover = getPopover('1')

  fireEvent.mouseOut(button)
  fireEvent.mouseOver(popover)
  fireEvent.mouseOut(popover)
  await waitForChange(button)

  expect(button).not.toHaveClass('is-active')
})
