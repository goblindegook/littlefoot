import test from 'tape'
import classList from 'dom-classlist'
import littlefoot from '../src/'
import { dispatchEvent } from '../src/events'
import setup from './helper/setup'
import teardown from './helper/teardown'
import sleep from './helper/sleep'

test('littlefoot setup with activateOnHover=true', t => {
  setup('default.html')

  const lf = littlefoot({ activateOnHover: true })

  const createDelay = lf.get('popoverCreateDelay')
  const footnote    = document.body.querySelector('[data-footnote-id="1"]')

  dispatchEvent(footnote, 'mouseover')

  t.ok(classList(footnote).contains('is-hover-instantiated'),
    'transitions popover activation on hover')

  sleep(createDelay)
    .then(() => {
      t.ok(classList(footnote).contains('is-active'),
        'activates popover on button hover event')

      teardown()
      t.end()
    })
})
