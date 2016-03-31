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

/**
 * Get element style property.
 * @param  {DOMElement} element  DOM element to inspect.
 * @param  {String}     property Name of the CSS property to get.
 * @return {String}              CSS property value.
 */
function getElementStyle(element, property) {
  const style = element.currentStyle || window.getComputedStyle(element)
  return style[property]
}

test('calculatePixelSize (none)', t => {
  const fixture = setup()

  fixture.style.display = 'none'
  t.equal(calculatePixelSize(fixture, 'display'), 10000, 'fixture property is none')

  teardown()
  t.end()
})

test.skip('calculatePixelSize (px)', t => {
  const fixture = setup()

  fixture.style.width = '100px'

  t.equal(calculatePixelSize(fixture, 'width'), 100, 'fixture property in px')

  fixture.style.width = '50px'

  t.equal(calculatePixelSize(fixture, 'width'),
    50 / parseFloat(getElementStyle(fixture.parentNode, 'width')),
    'fixture property <= 60px')

  teardown()
  t.end()
})

test.skip('calculatePixelSize (em)', t => {
  const fixture = setup()

  fixture.style.width = '10em'

  t.equal(calculatePixelSize(fixture, 'width'), 160,
    'fixture property in em with default font size')

  fixture.style.fontSize = '200%'

  t.equal(calculatePixelSize(fixture, 'width'), 320,
    'fixture property in em with 200% font size')

  teardown()
  t.end()
})

test.skip('calculatePixelSize (rem)', t => {
  const fixture = setup()

  fixture.style.width = '10rem' // 160px assuming 16px default font size
  t.equal(calculatePixelSize(fixture, 'width'), 160,
    'fixture property in rem')

  fixture.style.fontSize = '200%'
  t.equal(calculatePixelSize(fixture, 'width'), 160,
    'fixture property in rem with 200% font size')

  teardown()
  t.end()
})

test.skip('calculatePixelSize (%)', t => {
  const fixture = setup()

  fixture.style.width = '50%'

  t.equal(calculatePixelSize(fixture, 'width'),
    parseFloat(getElementStyle(fixture, 'width')),
    'fixture property in %')

  teardown()
  t.end()
})
