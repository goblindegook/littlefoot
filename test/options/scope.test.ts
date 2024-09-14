import { screen } from '@testing-library/dom'
import { expect, test } from 'vitest'
import littlefoot from '../../src/littlefoot'
import { getAllButtons, setDocumentBody } from '../helper'

test('creates buttons for all footnotes when scope is body', () => {
  setDocumentBody('default.html')
  littlefoot({ scope: 'body' })
  expect(getAllButtons()).toHaveLength(4)
})

test('creates no footnote buttons when scope is invalid', () => {
  setDocumentBody('default.html')
  littlefoot({ scope: '#invalid' })
  expect(
    screen.queryByRole('button', { name: /See Footnote/ }),
  ).not.toBeInTheDocument()
})
