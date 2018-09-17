import test from 'tape'
import {
  setup,
  sleep,
  teardown,
  getButton,
  click,
  mouseover,
  getAllActiveButtons,
  getAllButtons
} from './helper'
import littlefoot from '../src/'

test('setup with allowMultiple=true', async t => {
  setup('default')
  const lf = littlefoot({
    activateDelay: 0,
    dismissDelay: 0,
    allowMultiple: true
  })

  click(getButton('1'))
  click(getButton('2'))
  await sleep(1)

  t.equal(getAllActiveButtons().length, 2, 'allows multiple active popovers')

  lf.dismiss()
  await sleep(1)

  t.equal(
    getAllActiveButtons().length,
    0,
    'dismisses all popovers on dismiss()'
  )

  teardown()
  t.end()
})

test('activate with allowMultiple=true', async t => {
  setup('default')
  const lf = littlefoot({
    activateDelay: 0,
    dismissDelay: 0,
    allowMultiple: true
  })

  lf.activate('button[data-footnote-id]')
  await sleep(1)

  t.equal(
    getAllActiveButtons().length,
    4,
    'activate all popovers with activate()'
  )

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

  getAllButtons().forEach(mouseover)

  await sleep(1)

  t.equal(
    getAllActiveButtons().length,
    4,
    'adds the is-active class to all popovers'
  )

  teardown()
  t.end()
})

test('setup with allowMultiple=false', async t => {
  setup('default')
  littlefoot({ activateDelay: 0, allowMultiple: false })

  click(getButton('1'))
  await sleep(1)

  click(getButton('2'))
  await sleep(1)

  t.equal(
    getAllActiveButtons().length,
    1,
    'does not allow multiple active popovers'
  )

  teardown()
  t.end()
})
