import { test, expect } from 'vitest'
import { fireEvent } from '@testing-library/dom'
import { setDocumentBody, waitToStopChanging, getButton } from '../helper'
import littlefoot from '../../src/littlefoot'

test('setup with default contentTemplate', async () => {
  setDocumentBody('single.html')

  littlefoot({ activateDelay: 1 })

  const button = getButton('1')
  fireEvent.click(button)
  await waitToStopChanging(button)

  const footnote = document.querySelector<HTMLElement>('aside')
  expect(footnote?.dataset).toMatchObject({
    footnoteId: '1',
    footnotePopover: '',
  })

  const content = footnote?.querySelector('.littlefoot__content')
  expect(content).toContainHTML(`This is the document's only footnote.`)
})

test('setup with custom contentTemplate using <%= %> delimiters', async () => {
  setDocumentBody('single.html')

  littlefoot({
    activateDelay: 1,
    contentTemplate: `<aside class="custom"
      data-test-id="<%= id %>"
      data-test-number="<%= number %>"
      >
      <div class="littlefoot__wrapper">
        <div class="littlefoot__content">
          <%= content %>
        </div>
      </div>
    </aside>`,
  })

  const button = getButton('1')
  fireEvent.click(button)
  await waitToStopChanging(button)

  const footnote = document.querySelector<HTMLElement>('aside.custom')
  expect(footnote?.dataset).toMatchObject({
    footnoteId: '1',
    footnotePopover: '',
    testId: '1',
    testNumber: '1',
  })

  const content = footnote?.querySelector('.littlefoot__content')
  expect(content).toContainHTML(`This is the document's only footnote.`)
})

test('setup with custom contentTemplate using <% %> delimiters', async () => {
  setDocumentBody('single.html')

  littlefoot({
    activateDelay: 1,
    contentTemplate: `<aside class="custom"
      data-test-id="<% id %>"
      data-test-number="<% number %>"
      >
      <div class="littlefoot__wrapper">
        <div class="littlefoot__content">
          <% content %>
        </div>
      </div>
    </aside>`,
  })

  const button = getButton('1')
  fireEvent.click(button)
  await waitToStopChanging(button)

  const footnote = document.querySelector<HTMLElement>('aside.custom')
  expect(footnote?.dataset).toMatchObject({
    footnoteId: '1',
    footnotePopover: '',
    testId: '1',
    testNumber: '1',
  })

  const content = footnote?.querySelector('.littlefoot__content')
  expect(content).toContainHTML(`This is the document's only footnote.`)
})
