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

test('calculatePixelSize (px)', t => {
  const fixture = setup()

  fixture.style.width = '100px'

  t.equal(calculatePixelSize(fixture, 'width'), fixture.clientWidth,
    'fixture property in px')

  teardown()
  t.end()
})

test('calculatePixelSize (em)', t => {
  const fixture = setup()

  fixture.style.width = '10em' // 160px assuming 16px default font size

  t.equal(calculatePixelSize(fixture, 'width'), fixture.clientWidth,
    'fixture property in em with default font size')

  fixture.style.fontSize = '200%'

  t.equal(calculatePixelSize(fixture, 'width'), fixture.clientWidth,
    'fixture property in em with 200% font size')

  teardown()
  t.end()
})

test('calculatePixelSize (rem)', t => {
  const fixture = setup()

  fixture.style.width = '10rem' // 160px assuming 16px default font size
  t.equal(calculatePixelSize(fixture, 'width'), fixture.clientWidth,
    'fixture property in rem')

  fixture.style.fontSize = '200%'
  t.equal(calculatePixelSize(fixture, 'width'), fixture.clientWidth,
    'fixture property in rem with 200% font size')

  teardown()
  t.end()
})

test('calculatePixelSize (%)', t => {
  const fixture = setup()

  fixture.style.width = '50%'

  t.equal(calculatePixelSize(fixture, 'width'),
    Math.ceil(fixture.parentElement.clientWidth / 2),
    'fixture property in %')

  teardown()
  t.end()
})
