import test from 'tape'
import littlefoot from '../src/'
import classList from 'dom-classlist'
import simulant from 'simulant'
import { setup, sleep, teardown } from './helper'

test('setup with allowMultiple=true', async t => {
  setup('default')
  const lf = littlefoot({ activateDelay: 0, dismissDelay: 0, allowMultiple: true })

  simulant.fire(document.body.querySelector('button[data-footnote-id="1"]'), 'click')
  simulant.fire(document.body.querySelector('button[data-footnote-id="2"]'), 'click')
  await sleep(1)

  t.equal(document.body.querySelectorAll('button.is-active').length, 2,
    'allows multiple active popovers')

  lf.dismiss()
  await sleep(1)

  t.equal(document.body.querySelectorAll('button.is-active').length, 0,
    'dismisses all popovers on dismiss()')

  teardown()
  t.end()
})

test('activate with allowMultiple=true', async (t) => {
  setup('default')
  const lf = littlefoot({ activateDelay: 0, dismissDelay: 0, allowMultiple: true })

  lf.activate('button[data-footnote-id]')
  await sleep(1)

  t.equal(document.body.querySelectorAll('button.is-active').length, 4,
    'activate all popovers with activate()')

  teardown()
  t.end()
})

test('hover with allowMultiple=true', async t => {
  setup('default')

  littlefoot({
    activateDelay: 0,
    activateOnHover: true,
    allowMultiple: true
  })

  const footnotes = document.body.querySelectorAll('button')

  Array.from(footnotes).forEach(footnote => simulant.fire(footnote, 'mouseover'))

  await sleep(1)

  t.same(
    Array.from(footnotes).map(footnote => classList(footnote).contains('is-active')),
    [ true, true, true, true ],
    'adds the is-active class to all popovers'
  )

  teardown()
  t.end()
})

test('setup with allowMultiple=false', async t => {
  setup('default')
  littlefoot({ activateDelay: 0, allowMultiple: false })

  simulant.fire(document.body.querySelector('button[data-footnote-id="1"]'), 'click')
  await sleep(1)

  simulant.fire(document.body.querySelector('button[data-footnote-id="2"]'), 'click')
  await sleep(1)

  t.equal(document.body.querySelectorAll('button.is-active').length, 1,
    'does not allow multiple active popovers')

  teardown()
  t.end()
})
