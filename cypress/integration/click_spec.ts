context('Scroll', () => {
  beforeEach(() => {
    cy.server()
    cy.viewport(800, 600)
    cy.visit('/cypress/fixtures/click.html')
  })

  it('allows clicking links in popovers', () => {
    cy.getByTitle('See Footnote 1').click()
    cy.getAllByText('a link')
      .first()
      .click()
    cy.getByText('OK')
  })
})
