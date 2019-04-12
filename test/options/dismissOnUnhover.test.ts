import { fireEvent } from 'dom-testing-library'
import { setDocumentBody, waitForChange, getButton } from '../helper'
import littlefoot from '../../src'

test('dismiss on unhover', async () => {
  setDocumentBody('single.html')

  littlefoot({
    activateDelay: 1,
    activateOnHover: true,
    dismissDelay: 1,
    dismissOnUnhover: true,
    hoverDelay: 1
  })

  const button = getButton('1')

  fireEvent.mouseOver(button)
  await waitForChange(button)

  fireEvent.mouseOut(button)
  await waitForChange(button)

  expect(button).not.toHaveClass('is-hovered')
  expect(button).not.toHaveClass('is-active')
})
