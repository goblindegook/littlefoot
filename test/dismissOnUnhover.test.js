import test from 'tape'
import classList from 'dom-classlist'
import littlefoot from '../src/'
import simulant from 'simulant'
import { setup, sleep, teardown } from './helper'

test('littlefoot setup with dismissOnUnhover=true', (t) => {
  setup('default.html')

  const lf = littlefoot({ activateOnHover: true, dismissOnUnhover: true })

  const activateDelay = lf.getSetting('activateDelay')
  const dismissDelay = lf.getSetting('dismissDelay')
  const hoverDelay = lf.getSetting('hoverDelay')
  const footnote = document.body.querySelector('button[data-footnote-id="1"]')

  simulant.fire(footnote, 'mouseover')

  sleep(activateDelay)
    .then(() => {
      t.ok(classList(footnote).contains('is-active'),
        'popover has is-active class before unhover event')

      simulant.fire(footnote, 'mouseout')

      return sleep(dismissDelay + hoverDelay)
    })
    .then(() => {
      t.notOk(classList(footnote).contains('is-active'),
        'popover no longer has the is-active class after unhover event')

      teardown()
      t.end()
    })
})
