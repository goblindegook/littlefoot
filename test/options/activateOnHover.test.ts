import { fireEvent } from '@testing-library/dom'
import { expect, test } from 'vitest'
import littlefoot from '../../src/littlefoot'
import { getButton, setDocumentBody, waitToStopChanging } from '../helper'

test('activate on hover', async () => {
  setDocumentBody('single.html')
  littlefoot({ activateDelay: 1, activateOnHover: true, hoverDelay: 1 })

  const button = getButton('1')
  fireEvent.mouseOver(button)
  await waitToStopChanging(button)

  expect(button).toHaveClass('is-active')
})
