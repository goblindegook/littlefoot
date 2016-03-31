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

  const activateDelay = lf.get('activateDelay')
  const footnote    = document.body.querySelector('[data-footnote-id="1"]')

  dispatchEvent(footnote, 'mouseover')

  sleep(activateDelay)
    .then(() => {
      t.ok(classList(footnote).contains('is-hover-instantiated'),
        'adds the is-hover-instantiated class to the popover')

      t.ok(classList(footnote).contains('is-active'),
        'adds the is-active class to the popover')

      teardown()
      t.end()
    })
})
