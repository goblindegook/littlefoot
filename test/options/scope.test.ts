import { setDocumentBody, queryAll } from '../helper'
import littlefoot from '../../src'

test('creates buttons for all footnotes when scope is body', () => {
  setDocumentBody('default.html')

  littlefoot({ scope: 'body' })

  expect(queryAll('[data-footnote-button]')).toHaveLength(4)
  expect(queryAll('.footnote-processed')).toHaveLength(3)
})

test('creates no footnote buttons when scope is invalid', () => {
  setDocumentBody('default.html')

  littlefoot({ scope: '#invalid' })

  expect(queryAll('[data-footnote-button]')).toHaveLength(0)
  expect(queryAll('.footnote-processed')).toHaveLength(0)
})
