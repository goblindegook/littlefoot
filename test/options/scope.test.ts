import littlefoot from '../../src'
import { setDocumentBody, queryAll } from '../helper'

test('creates buttons for all footnotes when scope is body', () => {
  setDocumentBody('default.html')

  littlefoot({ scope: 'body' })

  expect(queryAll('[data-footnote-id]')).toHaveLength(4)
  expect(queryAll('.footnote-processed')).toHaveLength(3)
})

test('creates no footnote buttons when scope is invalid', () => {
  setDocumentBody('default.html')

  littlefoot({ scope: '#invalid' })

  expect(queryAll('[data-footnote-id]')).toHaveLength(0)
  expect(queryAll('.footnote-processed')).toHaveLength(0)
})
