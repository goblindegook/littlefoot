import { fireEvent } from 'dom-testing-library'
import { setDocumentBody, waitForChange, getButton } from '../helper'
import littlefoot from '../../src'

test('setup with custom contentTemplate', async () => {
  setDocumentBody('single.html')

  littlefoot({
    activateDelay: 1,
    contentTemplate: `<aside class="custom"
      data-footnote-popover-id="<%= id %>"
      data-footnote-number="<%= number %>"
      >
      <div class="littlefoot-footnote__wrapper">
        <div class="littlefoot-footnote__content">
          <%= content %>
        </div>
      </div>
    </aside>`
  })

  const button = getButton('1')
  fireEvent.click(button)
  await waitForChange(button)

  const footnote = document.querySelector('aside.custom')
  expect(footnote).toHaveAttribute('data-footnote-popover-id', '1')
  expect(footnote).toHaveAttribute('data-footnote-number', '1')

  const content = footnote!.querySelector('.littlefoot-footnote__content')
  expect(content).toContainHTML(`This is the document's only footnote.`)
})
