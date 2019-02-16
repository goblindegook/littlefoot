import littlefoot from '../../src'
import { setup, queryAllButtons } from '../helper'

test('allowDuplicates: false ignores duplicate footnote references', () => {
  setup('default.html')
  littlefoot({ allowDuplicates: false })
  expect(queryAllButtons()).toHaveLength(3)
})

test('allowDuplicates: true creates one buttons per footnote reference', () => {
  setup('default.html')
  littlefoot({ allowDuplicates: true })
  expect(queryAllButtons()).toHaveLength(4)
})

test('allowDuplicates: false creates all buttons when footnotes are in different containers', () => {
  setup('multiple.html')
  littlefoot({ allowDuplicates: false })
  expect(queryAllButtons()).toHaveLength(4)
})
