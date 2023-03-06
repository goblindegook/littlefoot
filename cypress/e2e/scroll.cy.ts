context('Scroll', () => {
  beforeEach(() => {
    cy.viewport(800, 600)
    cy.visit('/cypress/e2e/fixtures/scroll.html')
  })

  it('repositions popover above or below the button', () => {
    cy.findByTitle('See Footnote 1').click()
    cy.get('.littlefoot__popover').should('have.class', 'is-below')

    cy.scrollTo('top')
    cy.get('.littlefoot__popover').should('have.class', 'is-above')

    cy.scrollTo('bottom')
    cy.get('.littlefoot__popover').should('have.class', 'is-below')
  })

  it('scrolls popover content', () => {
    cy.findByTitle('See Footnote 1').click()

    cy.get('.littlefoot__popover')
      .should('have.class', 'is-scrollable')
      .and('not.have.class', 'is-fully-scrolled')

    cy.get('.littlefoot__content')
      .should('have.attr', 'tabindex', '0')
      .scrollTo('bottom')
      .trigger('wheel', { deltaY: 9999 })

    cy.get('.littlefoot__popover').should('have.class', 'is-fully-scrolled')

    cy.get('.littlefoot__content')
      .scrollTo('top')
      .trigger('wheel', { deltaY: -1 })

    cy.get('.littlefoot__popover').should('not.have.class', 'is-fully-scrolled')
  })
})
