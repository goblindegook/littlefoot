import test from 'tape'
import classList from 'dom-classlist'
import littlefoot from '../src/'
import simulant from 'simulant'
import { setup, sleep, teardown } from './helper'

test('dismiss on unhover', async t => {
  setup('default')

  littlefoot({
    activateDelay: 0,
    activateOnHover: true,
    dismissDelay: 0,
    dismissOnUnhover: true,
    hoverDelay: 0
  })

  const footnote = document.body.querySelector('button')

  simulant.fire(footnote, 'mouseover')

  await sleep(1)

  simulant.fire(footnote, 'mouseout')

  await sleep(1)

  t.notOk(classList(footnote).contains('is-active'),
    'removes the is-active class from popover')

  teardown()
  t.end()
})
