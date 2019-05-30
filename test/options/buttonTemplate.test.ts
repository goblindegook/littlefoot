import { getByTitle } from '@testing-library/dom'
import { setDocumentBody, getButton } from '../helper'
import littlefoot from '../../src'

beforeEach(() => {
  setDocumentBody('single.html')
})

test('default buttonTemplate', () => {
  littlefoot()

  const button = getButton('1')
  expect(button.id).toBe('fnref:1')
  expect(button.dataset).toMatchObject({
    footnoteButton: '',
    footnoteId: '1',
    footnoteNumber: '1'
  })
})

test('custom buttonTemplate', () => {
  littlefoot({
    buttonTemplate: `<button
      title="Footnote <%= number %>"
      data-test-content="<%= content %>"
      data-test-id="<%= id %>"
      data-test-number="<%= number %>"
      data-test-reference="<%= reference %>"
    />`
  })

  const button = getByTitle(document.body, 'Footnote 1')
  expect(button.dataset).toMatchObject({
    footnoteButton: '',
    footnoteId: '1',
    footnoteNumber: '1',
    testContent: /This is the document's only footnote\./,
    testId: '1',
    testNumber: '1',
    testReference: 'fnref:1'
  })
})
