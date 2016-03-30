import test from 'tape'
import littlefoot from '../src/'
import setup from './helper/setup'
import teardown from './helper/teardown'

test('littlefoot setup with custom buttonTemplate', t => {
  setup('default.html')

  const lf = littlefoot({
    buttonTemplate: require('./fixtures/buttonTemplate.html')
  })

  const footnotes = document.body.querySelectorAll('.footnote')
  const buttons   = document.body.querySelectorAll('button.custom')

  t.equal(buttons.length, footnotes.length, 'one custom button created per footnote')

  t.ok(buttons[0].getAttribute('data-content'), 'replaces content token')
  t.ok(buttons[0].getAttribute('data-id'), 'replaces id token')
  t.ok(buttons[0].getAttribute('data-number'), 'replaces number token')
  t.ok(buttons[0].getAttribute('data-reference'), 'replaces reference token')

  teardown()
  t.end()
})
