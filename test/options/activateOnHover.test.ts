import littlefoot from '../../src'
import { setDocumentBody, waitForChange, query } from '../helper'
import { fireEvent } from 'dom-testing-library'

test('activate on hover', async () => {
  setDocumentBody('single.html')
  littlefoot({ activateDelay: 1, activateOnHover: true, hoverDelay: 1 })

  const button = query('button')
  fireEvent.mouseOver(button, {})
  await waitForChange(button)

  expect(button).toHaveClass('is-hovered')
  expect(button).toHaveClass('is-active')
})
