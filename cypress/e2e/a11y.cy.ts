import { Result, RunOptions } from 'axe-core'

function terminalLog(violations: Result[]) {
  cy.task(
    'log',
    violations.length === 1
      ? `1 accessibility violation was detected`
      : `${violations.length} accessibility violations were detected`
  )

  cy.task(
    'table',
    violations.map(({ id, impact, description, nodes }) => ({
      id,
      impact,
      description,
      nodes: nodes.length,
    }))
  )
}

context('a11y', () => {
  beforeEach(() => {
    cy.visit('/cypress/e2e/fixtures/scroll.html')
    cy.injectAxe()
  })

  const options: RunOptions = {
    runOnly: {
      type: 'tag',
      values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
    },
  }

  it('has no detectable a11y violations on load', () => {
    cy.checkA11y(null, options, terminalLog)
  })

  it('has no detectable a11y violations after footnote activation', () => {
    cy.findByTitle('See Footnote 1').click()
    cy.checkA11y(null, options, terminalLog)
  })
})
