describe('Littlefoot .getSetting()', () => {
  it('returns default settings', () => {
    cy.visit('default.html')
    const lf = cy.window().invoke('littlefoot.default')
    lf.invoke('getSetting', 'dismissDelay').should('equal', 100)
  })
})
