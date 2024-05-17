const DEFAULT_VIEWPORT_HEIGHT = 600

context('Click', () => {
  beforeEach(() => {
    cy.viewport(800, DEFAULT_VIEWPORT_HEIGHT)
    cy.visit('/cypress/e2e/fixtures/click.html')
  })

  it('allows clicking links in popovers', () => {
    cy.findByTitle('See Footnote 1').click()
    cy.get('.littlefoot__popover').should('not.have.class', 'is-scrollable')
    cy.get('.littlefoot__content').should('not.have.attr', 'tabindex')
    cy.findAllByText('a link').first().click()
    cy.findByText('OK')
  })

  it('reveals popover content that is not scrollable when short', () => {
    cy.findByTitle('See Footnote 1').click()
    cy.get('.littlefoot__popover').should('not.have.class', 'is-scrollable')
    cy.get('.littlefoot__content').should('not.have.attr', 'tabindex')
  })

  it('popover layout upon resizing window before activation (#1702)', () => {
    cy.viewport(800, DEFAULT_VIEWPORT_HEIGHT + 100)
    cy.findByTitle('See Footnote 1').click()
    cy.get('.littlefoot__content').invoke('width').should('be.greaterThan', 100)
  })
})
