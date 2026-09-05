import { fireEvent, screen } from '@testing-library/dom'
import { beforeEach, expect, test } from 'vitest'
import littlefoot from '../src/littlefoot'
import { getButton, setDocumentBody, waitToStopChanging } from './helper'

// Recipes documented in README.md under "Recipes". Keep in sync.

function activateOnHash(instance: ReturnType<typeof littlefoot>) {
  const activateFromHash = () =>
    instance.activate(document.getElementById(location.hash.slice(1))?.dataset.footnoteId ?? '')

  window.addEventListener('hashchange', activateFromHash)
  activateFromHash()
}

beforeEach(() => {
  setDocumentBody('default.html')
  location.hash = ''
})

test('numeric buttonTemplate renders the footnote number', () => {
  littlefoot({
    numberResetSelector: 'article',
    buttonTemplate: `<button
    aria-label="Footnote <% number %>"
    class="littlefoot__button"
    id="<% reference %>"
    title="See Footnote <% number %>"
  ><% number %></button>`,
  })

  expect(screen.getByRole('button', { name: 'Footnote 3' })).toHaveTextContent('3')
})

test('activates footnote from the button ID in the hash on load', async () => {
  location.hash = '#lf-fnref:2'

  activateOnHash(littlefoot({ activateDelay: 1 }))

  const button = getButton('2')
  await waitToStopChanging(button)
  expect(button).toHaveClass('is-active')
})

test('activates footnote when the hash changes', async () => {
  activateOnHash(littlefoot({ activateDelay: 1 }))
  expect(document.querySelector('.littlefoot__popover')).toBeNull()

  location.hash = '#lf-fnref:1'
  fireEvent(window, new Event('hashchange'))

  const button = getButton('1')
  await waitToStopChanging(button)
  expect(button).toHaveClass('is-active')
})

test('unknown hash activates nothing', () => {
  location.hash = '#not-a-footnote'
  activateOnHash(littlefoot({ activateDelay: 1 }))
  expect(document.querySelector('.littlefoot__popover')).toBeNull()
})

test('activateCallback and dismissCallback keep the URL in sync', async () => {
  const instance = littlefoot({
    activateDelay: 1,
    activateCallback: (_popover, button) => {
      history.replaceState(null, '', '#' + button.id)
    },
    dismissCallback: () => {
      history.replaceState(null, '', location.pathname + location.search)
    },
  })

  const button = getButton('1')
  fireEvent.click(button)
  await waitToStopChanging(button)
  expect(location.hash).toBe('#lf-fnref:1')

  instance.dismiss('1')
  expect(location.hash).toBe('')
})
