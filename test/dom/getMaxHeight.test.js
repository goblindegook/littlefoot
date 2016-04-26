import test from 'tape'
import getMaxHeight from '../../src/dom/getMaxHeight'
import { teardown } from '../helper'

/**
 * Setup fixture.
 *
 * @return {DOMElement} DOM element fixture.
 */
function setup() {
  const fixture = document.createElement('div')
  document.body.appendChild(fixture)
  return fixture
}

test('getMaxHeight (em|rem)', (t) => {
  const fixture = setup()
  const sizes   = ['10em', '10rem']

  sizes.forEach((size) => {
    fixture.style.height    = size
    fixture.style.maxHeight = size

    t.equal(getMaxHeight(fixture, 'maxHeight'), fixture.clientHeight,
      'max-height: ' + size + ' with default font size')

    fixture.style.fontSize = '200%'

    t.equal(getMaxHeight(fixture, 'maxHeight'), fixture.clientHeight,
      'max-height: ' + size + ' with 200% font size')

    fixture.style.fontSize = '2em'

    t.equal(getMaxHeight(fixture, 'maxHeight'), fixture.clientHeight,
      'max-height: ' + size + ' with 2em font size')
  })

  teardown()
  t.end()
})

test('getMaxHeight (cm|in|mm|pc|pt|px)', (t) => {
  const fixture = setup()
  const sizes   = ['100cm', '100in', '100mm', '100pc', '100pt', '100px']

  sizes.forEach((size) => {
    fixture.style.height    = size
    fixture.style.maxHeight = size

    t.equal(getMaxHeight(fixture, 'maxHeight'), fixture.clientHeight, 'max-height: ' + size)
  })

  teardown()
  t.end()
})

test('getMaxHeight (%)', (t) => {
  const fixture = setup()

  fixture.style.height    = '50%'
  fixture.style.maxHeight = '50%'

  t.equal(getMaxHeight(fixture, 'maxHeight'),
    Math.round(document.body.clientHeight / 2),
    'max-height: 50%')

  teardown()
  t.end()
})
