import test from 'tape'
import { getMaxHeight } from '../../src/adapter/dom'
import { teardown } from '../helper'

function setup () {
  const fixture = document.createElement('div')
  document.body.appendChild(fixture)
  return fixture
}

test('getMaxHeight (none)', t => {
  const fixture = setup()

  fixture.style.maxHeight = 'none'

  t.equal(getMaxHeight(fixture), fixture.clientHeight, 'max-height: none')

  teardown()
  t.end()
})

test('getMaxHeight (em|rem)', t => {
  const fixture = setup()
  const sizes = ['10em', '10rem']

  sizes.forEach(size => {
    fixture.style.height = size
    fixture.style.maxHeight = size

    t.equal(
      getMaxHeight(fixture),
      fixture.clientHeight,
      'max-height: ' + size + ' with default font size'
    )

    fixture.style.fontSize = '200%'

    t.equal(
      getMaxHeight(fixture),
      fixture.clientHeight,
      'max-height: ' + size + ' with 200% font size'
    )

    fixture.style.fontSize = '2em'

    t.equal(
      getMaxHeight(fixture),
      fixture.clientHeight,
      'max-height: ' + size + ' with 2em font size'
    )
  })

  teardown()
  t.end()
})

test('getMaxHeight (cm|in|mm|pc|pt|px|vh)', t => {
  const fixture = setup()
  const sizes = ['100cm', '100in', '100mm', '100pc', '100pt', '100px', '100vh']

  sizes.forEach(size => {
    fixture.style.height = size
    fixture.style.maxHeight = size

    t.equal(getMaxHeight(fixture), fixture.clientHeight, 'max-height: ' + size)
  })

  teardown()
  t.end()
})

test('getMaxHeight (%)', t => {
  const fixture = setup()

  fixture.style.height = '100%'
  fixture.style.maxHeight = '50%'

  t.equal(
    getMaxHeight(fixture),
    Math.round(document.body.clientHeight / 2),
    'max-height: 50%'
  )

  teardown()
  t.end()
})
