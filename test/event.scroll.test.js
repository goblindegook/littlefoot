import test from 'tape'
import classList from 'dom-classlist'
import closest from 'dom-closest'
import simulant from 'simulant'
import littlefoot from '../src/'
import { setup, setupStylesheet, sleep, teardown } from './helper'

test('scroll event handling', (t) => {
  setup('scroll.html')

  const lf    = littlefoot()
  const delay = lf.getSetting('activateDelay')

  lf.activate('button[data-footnote-id="1"]')

  sleep(delay)
    .then(() => {
      const content = document.body.querySelector('.littlefoot-footnote__content')
      const popover = closest(content, '.littlefoot-footnote')

      t.ok(classList(popover).contains('is-positioned-top'),
        'popover is above the button')

      // FIXME: Scroll content.
      simulant.fire(document.body, 'wheel', { deltaY: document.body.scrollHeight })

      t.skip(classList(popover).contains('is-positioned-bottom'),
        'popover is repositioned below the button')

      teardown()
      t.end()
    })
})

test('content scroll event handling', (t) => {
  setup('scroll.html')
  setupStylesheet()

  const lf    = littlefoot()
  const delay = lf.getSetting('activateDelay')

  lf.activate('button[data-footnote-id="1"]')

  sleep(delay)
    .then(() => {
      const content = document.body.querySelector('.littlefoot-footnote__content')
      const popover = closest(content, '.littlefoot-footnote')

      t.ok(classList(popover).contains('is-scrollable'),
        'long popover content is scrollable')
      t.notOk(classList(popover).contains('is-fully-scrolled'),
        'long popover content starts out not fully scrolled')

      simulant.fire(content, 'wheel', { deltaY: content.scrollHeight })

      t.ok(classList(popover).contains('is-fully-scrolled'),
        'long popover content is fully scrolled after scroll to bottom')

      simulant.fire(content, 'wheel', { deltaY: -content.scrollHeight })

      t.notOk(classList(popover).contains('is-fully-scrolled'),
        'popover content is not fully scrolled after scroll to top')

      teardown()
      t.end()
    })
})
