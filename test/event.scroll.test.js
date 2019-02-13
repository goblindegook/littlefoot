import test from 'tape'
import simulant from 'simulant'
import littlefoot from '../src/'
import { isIE, setup, setupStylesheet, teardown } from './helper'

test.skip('scroll event handling', t => {
  setup('scroll')

  const lf = littlefoot({ activateDelay: 0 })

  lf.activate('button[data-footnote-id="1"]')

  const content = document.body.querySelector('.littlefoot-footnote__content')
  const popover = content.closest('.littlefoot-footnote')

  t.ok(
    popover.classList.contains('is-positioned-top'),
    'popover is above the button'
  )

  // FIXME: Fix document body scroll handling test.
  simulant.fire(document.body, 'wheel', { deltaY: document.body.scrollHeight })

  t.ok(
    popover.classList.contains('is-positioned-bottom'),
    'popover is repositioned below the button'
  )

  teardown()
  t.end()
})

test(
  'content scroll event handling',
  {
    skip: isIE() // FIXME: Fix content scroll handling tests on IE and Edge.
  },
  t => {
    setup('scroll')
    setupStylesheet()

    const lf = littlefoot({ activateDelay: 0 })

    lf.activate('button[data-footnote-id="1"]')

    const content = document.body.querySelector('.littlefoot-footnote__content')
    const popover = content.closest('.littlefoot-footnote')

    t.ok(
      popover.classList.contains('is-scrollable'),
      'long popover content is scrollable'
    )

    t.notOk(
      popover.classList.contains('is-fully-scrolled'),
      'long popover content starts out not fully scrolled'
    )

    simulant.fire(content, 'wheel', { deltaY: content.scrollHeight })

    t.ok(
      popover.classList.contains('is-fully-scrolled'),
      'long popover content is fully scrolled after scroll to bottom'
    )

    simulant.fire(content, 'wheel', { deltaY: -content.scrollHeight })

    t.notOk(
      popover.classList.contains('is-fully-scrolled'),
      'popover content is not fully scrolled after scroll to top'
    )

    teardown()
    t.end()
  }
)
