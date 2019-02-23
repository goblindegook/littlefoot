import littlefoot from '../../src'
import { setDocumentBody, query } from '../helper'

beforeEach(() => {
  setDocumentBody('single.html')
})

test('default buttonTemplate', () => {
  littlefoot()

  const button = query('button')
  expect(button).toHaveAttribute('id', 'fnref:1')
  expect(button).toHaveAttribute('data-footnote-id', '1')
  expect(button).toHaveAttribute('data-footnote-number', '1')
})

test('custom buttonTemplate', () => {
  littlefoot({
    buttonTemplate: `<button
      class="custom"
      data-reference="<%= reference %>"
      data-id="<%= id %>"
      data-number="<%= number %>"
      data-content="<%= content %>"
    >...</button>`
  })

  const button = query('button')
  expect(button).toHaveAttribute('data-id', '1')
  expect(button).toHaveAttribute('data-number', '1')
  expect(button).toHaveAttribute('data-reference', 'fnref:1')
  expect(button.getAttribute('data-content')).toContain(
    `This is the document's only footnote.`
  )
})
