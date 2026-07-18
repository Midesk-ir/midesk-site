describe('Tenant auth', () => {
  it('logs in via API and reaches dashboard', () => {
    cy.loginAsTenant()
    cy.visit('/dashboard')
    cy.url().should('include', '/dashboard')
  })
})
