import { fireEvent } from '@testing-library/dom'
import {
  setDocumentBody,
  waitToStartChanging,
  waitToStopChanging,
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
  await waitToStopChanging(button)

  fireEvent.mouseOut(button)
  await waitToStartChanging(button)
  await waitToStopChanging(button)

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
  await waitToStopChanging(button)

  const popover = getPopover('1')

  fireEvent.mouseOut(button)
  fireEvent.mouseOver(popover)
  fireEvent.mouseOut(popover)
  await waitToStartChanging(button)
  await waitToStopChanging(button)

  expect(button).not.toHaveClass('is-active')
})
