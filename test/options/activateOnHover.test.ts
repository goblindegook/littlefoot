import littlefoot from '../../src'
import { setup, waitForTransition } from '../helper'
import { fireEvent } from 'dom-testing-library'

test('activate on hover', async () => {
  setup('single.html')
  littlefoot({ activateDelay: 1, activateOnHover: true, hoverDelay: 1 })

  const button = document.querySelector('button')!
  fireEvent.mouseOver(button, {})
  await waitForTransition(button)

  expect(button).toHaveClass('is-hovered')
  expect(button).toHaveClass('is-active')
})
