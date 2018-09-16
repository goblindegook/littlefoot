import test from 'tape'
import sinon from 'sinon'
import { setup, teardown } from './helper'
import littlefoot from '../src/'

test('setup with activateCallback', t => {
  setup('default')
  const activateCallback = sinon.spy()
  const { activate } = littlefoot({ activateDelay: 0, activateCallback })

  activate('button[data-footnote-id="1"]')

  const popover = document.querySelector('aside[data-footnote-id="1"]')
  const button = document.querySelector('button[data-footnote-id="1"]')

  t.ok(
    activateCallback.calledWithExactly(popover, button),
    'activateCallback called'
  )

  teardown()
  t.end()
})
