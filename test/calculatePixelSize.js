import test from 'tape'
import calculatePixelSize from '../src/calculatePixelSize'
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

test('calculatePixelSize (none)', t => {
  const fixture = setup()

  fixture.style.display = 'none'
  t.equal(calculatePixelSize(fixture, 'display'), 10000, 'fixture property is none')

  teardown()
  t.end()
})

test('calculatePixelSize (em|rem)', t => {
  const fixture = setup()
  const sizes   = ['10em', '10rem']

  sizes.forEach(width => {
    fixture.style.width = width

    t.equal(calculatePixelSize(fixture, 'width'), fixture.clientWidth,
      width + ' width with default font size')

    fixture.style.fontSize = '200%'

    t.equal(calculatePixelSize(fixture, 'width'), fixture.clientWidth,
      width + ' width with 200% font size')
  })

  teardown()
  t.end()
})

test('calculatePixelSize (cm|in|mm|pc|pt|px)', t => {
  const fixture = setup()
  const sizes   = ['100cm', '100in', '100mm', '100pc', '100pt', '100px']

  sizes.forEach(width => {
    fixture.style.width = width

    t.equal(calculatePixelSize(fixture, 'width'), fixture.clientWidth, width + ' width')
  })

  teardown()
  t.end()
})

test('calculatePixelSize (%)', t => {
  const fixture = setup()

  fixture.style.width = '50%'

  t.equal(calculatePixelSize(fixture, 'width'),
    Math.round(fixture.parentElement.clientWidth / 2),
    'fixture property in %')

  teardown()
  t.end()
})
