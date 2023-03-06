import { test, expect, beforeEach } from 'vitest'
import { screen } from '@testing-library/dom'
import { setDocumentBody, getButton } from '../helper'
import littlefoot from '../../src/littlefoot'

beforeEach(() => {
  setDocumentBody('single.html')
})

test('default buttonTemplate', () => {
  littlefoot()

  const button = getButton('1')
  expect(button.id).toBe('lf-fnref:1')
  expect(button.dataset).toMatchObject({
    footnoteButton: '',
    footnoteId: '1',
  })
})

test('custom buttonTemplate using <%= %> delimiters', () => {
  littlefoot({
    buttonTemplate: `<button
      title="Footnote <%= number %>"
      data-test-content="<%= content %>"
      data-test-id="<%= id %>"
      data-test-number="<%= number %>"
      data-test-reference="<%= reference %>"
    />`,
  })

  const button = screen.getByRole('button', { name: 'Footnote 1' })
  expect(button.dataset).toMatchObject({
    footnoteButton: '',
    footnoteId: '1',
    testContent: `<p>
          This is the document's only footnote.
        </p>`,
    testId: '1',
    testNumber: '1',
    testReference: 'lf-fnref:1',
  })
})

test('custom buttonTemplate using <% %> delimiters', () => {
  littlefoot({
    buttonTemplate: `<button
      title="Footnote <% number %>"
      data-test-content="<% content %>"
      data-test-id="<% id %>"
      data-test-number="<% number %>"
      data-test-reference="<% reference %>"
    />`,
  })

  const button = screen.getByRole('button', { name: 'Footnote 1' })
  expect(button.dataset).toMatchObject({
    footnoteButton: '',
    footnoteId: '1',
    testContent: `<p>
          This is the document's only footnote.
        </p>`,
    testId: '1',
    testNumber: '1',
    testReference: 'lf-fnref:1',
  })
})
