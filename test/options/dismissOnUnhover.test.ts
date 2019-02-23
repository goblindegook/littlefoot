import littlefoot from '../../src'
import { setDocumentBody, waitForTransition, query } from '../helper'
import { fireEvent } from 'dom-testing-library'

test('dismiss on unhover', async () => {
  setDocumentBody('single.html')

  littlefoot({
    activateDelay: 1,
    activateOnHover: true,
    dismissDelay: 1,
    dismissOnUnhover: true,
    hoverDelay: 1
  })

  const button = query('button')

  fireEvent.mouseOver(button)
  await waitForTransition(button)

  fireEvent.mouseOut(button)
  await waitForTransition(button)

  expect(button).not.toHaveClass('is-hovered')
  expect(button).not.toHaveClass('is-active')
})
