describe('Smoke', () => {
  it('loads the landing page', () => {
    cy.visit('/')
    cy.contains('Midesk', { matchCase: false }).should('exist')
  })

  it('loads the login page', () => {
    cy.visit('/login')
    cy.get('input[type="email"], input[name="email"]').should('exist')
    cy.get('input[type="password"], input[name="password"]').should('exist')
  })

  it('loads super-admin login', () => {
    cy.visit('/super-admin/login')
    cy.contains(/super admin|سوپر ادمین/i).should('exist')
  })
})
