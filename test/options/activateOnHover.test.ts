import littlefoot from '../../src'
import { setDocumentBody, waitForTransition, query } from '../helper'
import { fireEvent } from 'dom-testing-library'

test('activate on hover', async () => {
  setDocumentBody('single.html')
  littlefoot({ activateDelay: 1, activateOnHover: true, hoverDelay: 1 })

  const button = query('button')
  fireEvent.mouseOver(button, {})
  await waitForTransition(button)

  expect(button).toHaveClass('is-hovered')
  expect(button).toHaveClass('is-active')
})
