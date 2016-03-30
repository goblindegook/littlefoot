import test from 'tape'
import simulant from 'simulant'
import classList from 'dom-classlist'
import littlefoot from '../src/'
import setup from './helper/setup'
import teardown from './helper/teardown'
import sleep from './helper/sleep'

test.skip('scroll event handling', t => {
  setup('default.html')

  const lf = littlefoot()

  const createDelay = lf.get('popoverCreateDelay')

  lf.activate('[data-footnote-id="4"]')

  sleep(createDelay)
    .then(() => {
      const content        = document.body.querySelector('.littlefoot-footnote__content')
      const wheelEventDown = createWheelEvent('wheel', 0, 100)
      const wheelEventUp   = createWheelEvent('wheel', 0, -50)

      simulant.fire(content, 'wheel', { deltaX: 0, deltaY: 100, deltaZ: 0 })
      simulant.fire(content, 'wheel', { deltaX: 0, deltaY: -100, deltaZ: 0 })

      if (content.scrollTop) {
        t.ok(document.body.querySelector('.is-scrollable'), 'is scrollable')
      } else {
        t.notOk(document.body.querySelector('.is-scrollable'), 'is not scrollable')
      }

      teardown()
      t.end()
    })
})
