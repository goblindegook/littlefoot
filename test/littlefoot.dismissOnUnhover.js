import test from 'tape'
import classList from 'dom-classlist'
import littlefoot from '../src/'
import { dispatchEvent } from '../src/events'
import setup from './helper/setup'
import teardown from './helper/teardown'
import sleep from './helper/sleep'

test('littlefoot setup with dismissOnUnhover=true', t => {
  setup('default.html')

  const lf = littlefoot({ activateOnHover: true, dismissOnUnhover: true })

  const createDelay  = lf.get('popoverCreateDelay')
  const dismissDelay = lf.get('popoverDismissDelay')
  const hoverDelay   = lf.get('hoverDelay')
  const footnote     = document.body.querySelector('[data-footnote-id="1"]')

  dispatchEvent(footnote, 'mouseover')

  sleep(createDelay)
    .then(() => {
      t.ok(classList(footnote).contains('is-active'),
        'popover has is-active class before unhover event')

      dispatchEvent(footnote, 'mouseout')

      return sleep(dismissDelay + hoverDelay)
    })
    .then(() => {
      t.notOk(classList(footnote).contains('is-active'),
        'popover no longer has the is-active class after unhover event')

      teardown()
      t.end()
    })
})
