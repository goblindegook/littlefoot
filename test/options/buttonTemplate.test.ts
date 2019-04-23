import { getByTitle } from 'dom-testing-library'
import { setDocumentBody, getButton } from '../helper'
import littlefoot from '../../src'

beforeEach(() => {
  setDocumentBody('single.html')
})

test('default buttonTemplate', () => {
  littlefoot()

  const button = getButton('1')
  expect(button).toHaveAttribute('id', 'fnref:1')
  expect(button).toHaveAttribute('data-footnote-button-id', '1')
  expect(button).toHaveAttribute('data-footnote-number', '1')
})

test('custom buttonTemplate', () => {
  littlefoot({
    buttonTemplate: `<button
      title="Footnote <%= number %>"
      data-id="<%= id %>"
      data-number="<%= number %>"
      data-reference="<%= reference %>"
      data-content="<%= content %>"
    />`
  })

  const button = getByTitle(document.body, 'Footnote 1')
  expect(button).toHaveAttribute('data-id', '1')
  expect(button).toHaveAttribute('data-number', '1')
  expect(button).toHaveAttribute('data-reference', 'fnref:1')
  expect(button.getAttribute('data-content')).toContain(
    `This is the document's only footnote.`
  )
})
