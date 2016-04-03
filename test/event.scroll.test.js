import test from 'tape'
import simulant from 'simulant'
import littlefoot from '../src/'
import { setup, sleep, teardown } from './helper'

// FIXME: Test scroll events consistently across browsers.

test.skip('scroll event handling', (t) => {
  setup('default.html')

  const lf = littlefoot()

  const activateDelay = lf.getSetting('activateDelay')

  lf.activate('button[data-footnote-id="4"]')

  sleep(activateDelay)
    .then(() => {
      const content = document.body.querySelector('.littlefoot-footnote__content')

      simulant.fire(content, 'wheel', { deltaY: 100 })

      if (content.scrollTop) {
        t.ok(document.body.querySelector('.is-scrollable'), 'is scrollable')
      } else {
        t.notOk(document.body.querySelector('.is-scrollable'), 'is not scrollable')
      }

      teardown()
      t.end()
    })
})
