import { fireEvent } from 'dom-testing-library'
import { setup, getButton, waitForTransition } from './helper'
import littlefoot from '../src'

beforeEach(() => {
  setup('scroll.html')
})

test('reposition popover below the button', async () => {
  littlefoot({ activateDelay: 1 })

  const button = getButton('1')
  fireEvent.click(button)
  await waitForTransition(button)

  const content = document.querySelector('.littlefoot-footnote__content')!
  const popover = content.closest('.littlefoot-footnote')

  // expect(popover).toHaveClass('is-positioned-top') // FIXME

  fireEvent.wheel(document.body, { deltaY: document.body.scrollHeight })

  expect(popover).toHaveClass('is-positioned-bottom')
})

test('content scroll', async () => {
  littlefoot({ activateDelay: 1 })

  const button = getButton('1')
  fireEvent.click(button)
  await waitForTransition(button)

  const content = document.querySelector('.littlefoot-footnote__content')!
  const popover = content.closest('.littlefoot-footnote')

  expect(popover).toHaveClass('is-scrollable')
  expect(popover).not.toHaveClass('is-fully-scrolled')

  fireEvent.wheel(content, { deltaY: content.scrollHeight })

  // expect(popover).toHaveClass('is-fully-scrolled') // FIXME

  fireEvent.wheel(content, { deltaY: -content.scrollHeight })

  expect(popover).not.toHaveClass('is-fully-scrolled')
})
