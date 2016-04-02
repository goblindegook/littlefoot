import test from 'tape'
import getStylePropertyInPixels from '../../src/dom/getStylePropertyInPixels'
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

test('getStylePropertyInPixels (none)', (t) => {
  const fixture = setup()

  fixture.style.display = 'none'
  t.equal(getStylePropertyInPixels(fixture, 'display'), 10000, 'display: none')

  teardown()
  t.end()
})

test('getStylePropertyInPixels (em|rem)', (t) => {
  const fixture = setup()
  const sizes   = ['10em', '10rem']

  sizes.forEach((size) => {
    fixture.style.width = size
    fixture.style.minWidth = size

    t.equal(getStylePropertyInPixels(fixture, 'width'), fixture.clientWidth,
      'width: ' + size + ' with default font size')

    t.equal(getStylePropertyInPixels(fixture, 'minWidth'), fixture.clientWidth,
      'min-width: ' + size + ' with default font size')

    fixture.style.fontSize = '200%'

    t.equal(getStylePropertyInPixels(fixture, 'width'), fixture.clientWidth,
      'min-width: ' + size + ' with 200% font size')

    t.equal(getStylePropertyInPixels(fixture, 'minWidth'), fixture.clientWidth,
      'width: ' + size + ' with 200% font size')
  })

  teardown()
  t.end()
})

test('getStylePropertyInPixels (cm|in|mm|pc|pt|px)', (t) => {
  const fixture = setup()
  const sizes   = ['100cm', '100in', '100mm', '100pc', '100pt', '100px']

  sizes.forEach((size) => {
    fixture.style.width    = size
    fixture.style.minWidth = size

    t.equal(getStylePropertyInPixels(fixture, 'width'), fixture.clientWidth, 'width: ' + size)
    t.equal(getStylePropertyInPixels(fixture, 'minWidth'), fixture.clientWidth, 'min-width: ' + size)
  })

  teardown()
  t.end()
})

test('getStylePropertyInPixels (%)', (t) => {
  const fixture = setup()

  fixture.style.width = '50%'

  t.equal(getStylePropertyInPixels(fixture, 'width'),
    fixture.clientWidth,
    'width: 50%')

  fixture.style.minWidth = '50%'

  t.equal(getStylePropertyInPixels(fixture, 'minWidth'),
    Math.round(document.body.clientWidth / 2),
    'min-width: 50%')

  teardown()
  t.end()
})
