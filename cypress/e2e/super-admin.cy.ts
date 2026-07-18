describe('Super Admin', () => {
  beforeEach(() => {
    cy.loginAsSuperAdmin()
  })

  it('opens dashboard', () => {
    cy.visit('/super-admin/dashboard')
    cy.url().should('include', '/super-admin/dashboard')
    cy.contains(/dashboard|داشبورد/i).should('exist')
  })

  it('opens system check panel', () => {
    cy.visit('/super-admin/system-check')
    cy.url().should('include', '/super-admin/system-check')
    cy.contains(/system check|بررسی سیستم/i).should('exist')
    cy.contains(/backend|بک‌اند/i).should('exist')
  })

  it('loads plans page', () => {
    cy.visit('/super-admin/plans')
    cy.url().should('include', '/super-admin/plans')
    cy.contains(/plan|پلن/i).should('exist')
  })
})
