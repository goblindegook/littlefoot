context('Scroll', () => {
  beforeEach(() => {
    cy.server()
    cy.viewport(800, 600)
    cy.visit('/cypress/fixtures/click.html')
  })

  it('allows clicking links in popovers', () => {
    cy.get('button').click()
    cy.getByText('a link').click()
    cy.getByText('OK')
  })
})
