import littlefoot from '../../src'
import { setup, queryAllButtons } from '../helper'

test('create one button per footnote reference', () => {
  setup('default.html')
  littlefoot({ allowDuplicates: true })
  expect(queryAllButtons()).toHaveLength(4)
})

test('ignore duplicate footnote references', () => {
  setup('default.html')
  littlefoot({ allowDuplicates: false })
  expect(queryAllButtons()).toHaveLength(3)
})

test('create all buttons when footnotes are in different containers', () => {
  setup('multiple.html')
  littlefoot({ allowDuplicates: false })
  expect(queryAllButtons()).toHaveLength(4)
})
