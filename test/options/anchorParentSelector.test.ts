import { setDocumentBody, queryAll } from '../helper'
import littlefoot from '../../src'

beforeEach(() => {
  setDocumentBody('default.html')
})

test('hides original footnote anchor parent', () => {
  littlefoot({ anchorParentSelector: 'sup' })
  expect(queryAll('sup.footnote-print-only')).toHaveLength(4)
})
