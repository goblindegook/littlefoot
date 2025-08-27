import { fireEvent, waitFor } from '@testing-library/dom'
import { expect, test } from 'vitest'
import littlefoot from '../../src/littlefoot'
import { getButton, getPopover, setDocumentBody } from '../helper'

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
  expect(button).toHaveClass('is-active')

  fireEvent.mouseOut(button)
  await waitFor(() => expect(button).not.toHaveClass('is-active'))
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
  const popover = getPopover('1')

  fireEvent.mouseOut(button)
  fireEvent.mouseOver(popover)
  expect(button).toHaveClass('is-active')

  fireEvent.mouseOut(popover)
  await waitFor(() => expect(button).not.toHaveClass('is-active'))
})
