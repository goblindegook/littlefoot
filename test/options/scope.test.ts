import { test, expect } from 'vitest'
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
    screen.queryByRole('button', { name: /See Footnote/ })
  ).not.toBeInTheDocument()
})
