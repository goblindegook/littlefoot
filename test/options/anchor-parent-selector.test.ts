import { fireEvent } from '@testing-library/dom'
import { expect, test } from 'vitest'
import littlefoot from '../../src/littlefoot'
import { getButton, getPopover, setDocumentBody } from '../helper'

test('hides original footnote anchor parent', () => {
  setDocumentBody('default.html')
  littlefoot({ anchorParentSelector: 'sup' })
  expect(document.querySelectorAll('sup.littlefoot--print')).toHaveLength(4)
})

test('uses reference ID from the link', () => {
  setDocumentBody('backlink.html')
  littlefoot({ activateDelay: 1 })
  fireEvent.click(getButton('3'))
  expect(getPopover('3').querySelector('sup')).toBeNull()
})
