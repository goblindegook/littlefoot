import { test, expect } from 'vitest'
import littlefoot from '../../src/littlefoot'
import { setDocumentBody, getAllButtons } from '../helper'

test('create one button per footnote reference', () => {
  setDocumentBody('default.html')
  littlefoot({ allowDuplicates: true })
  expect(getAllButtons()).toHaveLength(4)
})

test('ignore duplicate footnote references', () => {
  setDocumentBody('default.html')
  littlefoot({ allowDuplicates: false })
  expect(getAllButtons()).toHaveLength(3)
})

test('create all buttons when footnotes are in different containers', () => {
  setDocumentBody('multiple.html')
  littlefoot({ allowDuplicates: false })
  expect(getAllButtons()).toHaveLength(5)
})
