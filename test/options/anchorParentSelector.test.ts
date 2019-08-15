import { setDocumentBody, queryAll } from '../helper'
import littlefoot from '../../src'

test('hides original footnote anchor parent', () => {
  setDocumentBody('default.html')
  littlefoot({ anchorParentSelector: 'sup' })
  expect(queryAll('sup.footnote-print-only')).toHaveLength(4)
})
