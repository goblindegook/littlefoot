import { screen } from '@testing-library/dom'
import { getAllButtons, setDocumentBody } from '../helper'
import littlefoot from '../../src/littlefoot'

test('creates buttons for all footnotes when scope is body', () => {
  setDocumentBody('default.html')
  littlefoot({ scope: 'body' })
  expect(getAllButtons()).toHaveLength(4)
})

test('creates no footnote buttons when scope is invalid', () => {
  setDocumentBody('default.html')
  littlefoot({ scope: '#invalid' })
  expect(
    screen.queryAllByRole('button', { name: /See Footnote/ })
  ).toHaveLength(0)
})
