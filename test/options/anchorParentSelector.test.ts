import { fireEvent } from '@testing-library/dom'
import { setDocumentBody, getButton, getPopover, queryAll } from '../helper'
import littlefoot from '../../src'

test('hides original footnote anchor parent', () => {
  setDocumentBody('default.html')
  littlefoot({ anchorParentSelector: 'sup' })
  expect(queryAll('sup.footnote-print-only')).toHaveLength(4)
})

test.skip('strips backlink parent from the footnote body', () => {
  setDocumentBody('backlink.html')
  littlefoot()
  fireEvent.click(getButton('1'))
  expect(getPopover('1').querySelector('sup')).toBeNull()
})
