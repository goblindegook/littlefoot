import test from 'tape'
import getStylePropertyInPixels from '../src/dom/getStylePropertyInPixels'
import teardown from './helper/teardown'

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
  t.equal(getStylePropertyInPixels(fixture, 'display'), 10000, 'fixture property is none')

  teardown()
  t.end()
})

test('getStylePropertyInPixels (em|rem)', (t) => {
  const fixture = setup()
  const sizes   = ['10em', '10rem']

  sizes.forEach((size) => {
    fixture.style.width = size

    t.equal(getStylePropertyInPixels(fixture, 'width'), fixture.clientWidth,
      size + ' width with default font size')

    fixture.style.fontSize = '200%'

    t.equal(getStylePropertyInPixels(fixture, 'width'), fixture.clientWidth,
      size + ' width with 200% font size')
  })

  teardown()
  t.end()
})

test('getStylePropertyInPixels (cm|in|mm|pc|pt|px)', (t) => {
  const fixture = setup()
  const sizes   = ['100cm', '100in', '100mm', '100pc', '100pt', '100px']

  sizes.forEach((size) => {
    fixture.style.width  = size
    fixture.style.height = size

    t.equal(getStylePropertyInPixels(fixture, 'width'), fixture.clientWidth, size + ' width')
  })

  teardown()
  t.end()
})

test('getStylePropertyInPixels (%)', (t) => {
  const fixture = setup()

  fixture.style.width = '50%'

  t.equal(getStylePropertyInPixels(fixture, 'width'),
    Math.round(fixture.parentElement.clientWidth / 2),
    'fixture property in %')

  teardown()
  t.end()
})
