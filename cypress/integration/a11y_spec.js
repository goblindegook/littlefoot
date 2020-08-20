function terminalLog(violations) {
  cy.task(
    'log',
    `${violations.length} accessibility violation${
    violations.length === 1 ? '' : 's'
    } ${violations.length === 1 ? 'was' : 'were'} detected`
  )
  // pluck specific keys to keep the table readable
  const violationData = violations.map(
    ({ id, impact, description, nodes }) => ({
      id,
      impact,
      description,
      nodes: nodes.length,
    })
  )
  cy.task('table', violationData)
}

context('a11y', () => {
  beforeEach(() => {
    cy.server()
    cy.viewport(800, 600)
    cy.visit('/cypress/fixtures/click.html')
    cy.injectAxe()
  })
  const setup = {
    runOnly: {
      type: 'tag',
      values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
    },
  }
  it('Has no detectable a11y violations on load', () => {
    cy.checkA11y(null, setup, terminalLog)
  })
  it('Has no detectable a11y violations after clicking on it', () => {
    cy.findByTitle('See Footnote 1').click()
    cy.checkA11y(null, setup, terminalLog)
  })
})
