import test from 'tape'
import classList from 'dom-classlist'
import littlefoot from '../src/'
import { setup, sleep, teardown, getButton, mouseover } from './helper'

test('activate on hover', async t => {
  setup('default')

  littlefoot({ activateDelay: 0, activateOnHover: true })

  const button = getButton('1')

  mouseover(button)

  await sleep(1)

  t.ok(
    classList(button).contains('is-hovered'),
    'adds the is-hovered class to the popover'
  )

  t.ok(
    classList(button).contains('is-active'),
    'adds the is-active class to the popover'
  )

  teardown()
  t.end()
})
