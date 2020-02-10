context('Scroll', () => {
  beforeEach(() => {
    cy.server()
    cy.viewport(800, 600)
    cy.visit('/cypress/fixtures/click.html')
  })

  it('allows clicking links in popovers', () => {
    cy.findByTitle('See Footnote 1').click()
    cy.findAllByText('a link')
      .first()
      .click()
    cy.findByText('OK')
  })
})
