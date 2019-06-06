import { setDocumentBody, getAllButtons } from '../helper'
import littlefoot from '../../src'

test('enhances all footnotes when footnoteSelector is the default', () => {
  setDocumentBody('default.html')
  littlefoot({})
  expect(getAllButtons()).toHaveLength(4)
})

test('enhances a single footnote when footnoteSelector is :first-child', () => {
  setDocumentBody('default.html')
  littlefoot({ footnoteSelector: 'li:first-child' })
  expect(getAllButtons()).toHaveLength(1)
})

test('enhances no footnotes when footnoteSelector is invalid', () => {
  setDocumentBody('default.html')
  littlefoot({ footnoteSelector: '#invalid' })
  expect(getAllButtons()).toHaveLength(0)
})
