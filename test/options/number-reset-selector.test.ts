import { beforeEach, expect, test } from 'vitest'
import littlefoot from '../../src/littlefoot'
import { getAllButtons, setDocumentBody } from '../helper'

beforeEach(() => {
  setDocumentBody('multiple.html')
})

test('setup with numberResetSelector creates footnotes with duplicate numbers', () => {
  littlefoot({
    numberResetSelector: 'article',
    buttonTemplate:
      '<button title="See Footnote <% number %>"><% number %></button>',
  })
  const buttons = getAllButtons()
  const buttonNumbers = buttons.map((button) => button.textContent)
  expect(buttonNumbers).toEqual(['1', '2', '1', '2', '3'])
})

test('setup without numberResetSelector creates footnotes with unique numbers', () => {
  littlefoot({
    numberResetSelector: undefined,
    buttonTemplate:
      '<button title="See Footnote <% number %>"><% number %></button>',
  })
  const buttons = getAllButtons()
  const buttonNumbers = buttons.map((button) => button.textContent)
  expect(buttonNumbers).toEqual(['1', '2', '3', '4', '5'])
})
