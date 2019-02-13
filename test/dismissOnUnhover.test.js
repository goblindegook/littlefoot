import test from 'tape'
import littlefoot from '../src/'
import {
  setup,
  sleep,
  teardown,
  mouseover,
  mouseout,
  getButton
} from './helper'

test('dismiss on unhover', async t => {
  setup('default')

  littlefoot({
    activateDelay: 0,
    activateOnHover: true,
    dismissDelay: 0,
    dismissOnUnhover: true,
    hoverDelay: 0
  })

  const button = getButton('1')

  mouseover(button)
  await sleep(1)

  mouseout(button)
  await sleep(1)

  t.notOk(
    button.classList.contains('is-active'),
    'removes the is-active class from button'
  )

  teardown()
  t.end()
})
