import test from 'tape'
import classList from 'dom-classlist'
import littlefoot from '../src/'
import setup from './helper/setup'
import teardown from './helper/teardown'
import sleep from './helper/sleep'
import { createWheelEvent } from './helper/events'

test('scroll event handling', t => {
  setup('default.html')

  const body = document.body

  const lf = littlefoot()

  const createDelay  = lf.get('popoverCreateDelay')
  const dismissDelay = lf.get('popoverDismissDelay')

  lf.activate('[data-footnote-id="4"]')

  sleep(createDelay)
    .then(() => {
      const content        = body.querySelector('.littlefoot-footnote__content')
      const wheelEventDown = createWheelEvent('wheel', 0, 100)
      const wheelEventUp   = createWheelEvent('wheel', 0, -50)

      content.dispatchEvent(wheelEventDown)
      content.dispatchEvent(wheelEventUp)

      if (content.scrollTop) {
        t.ok(body.querySelector('.is-scrollable'), 'is scrollable')
      } else {
        t.notOk(body.querySelector('.is-scrollable'), 'is not scrollable')
      }

      teardown()
      t.end()
    })
})
