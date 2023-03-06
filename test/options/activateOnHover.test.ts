import { test, expect } from 'vitest'
import littlefoot from '../../src/littlefoot'
import { setDocumentBody, waitToStopChanging, getButton } from '../helper'
import { fireEvent } from '@testing-library/dom'

test('activate on hover', async () => {
  setDocumentBody('single.html')
  littlefoot({ activateDelay: 1, activateOnHover: true, hoverDelay: 1 })

  const button = getButton('1')
  fireEvent.mouseOver(button)
  await waitToStopChanging(button)

  expect(button).toHaveClass('is-active')
})
