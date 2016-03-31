import test from 'tape'
import simulant from 'simulant'
import classList from 'dom-classlist'
import littlefoot from '../src/'
import setup from './helper/setup'
import teardown from './helper/teardown'
import sleep from './helper/sleep'

// FIXME: Test scroll events consistently across browsers.

test.skip('scroll event handling', t => {
  setup('default.html')

  const lf = littlefoot()

  const activateDelay = lf.get('activateDelay')

  lf.activate('[data-footnote-id="4"]')

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
