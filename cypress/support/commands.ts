type CaptchaChallenge = {
  id: string
  seal: string
  targetAngle: number
}

declare global {
  namespace Cypress {
    interface Chainable {
      getCaptchaToken(): Chainable<string>
      loginAsTenant(email?: string, password?: string): Chainable<void>
      loginAsSuperAdmin(email?: string, password?: string): Chainable<void>
    }
  }
}

Cypress.Commands.add('getCaptchaToken', () => {
  return cy.request<CaptchaChallenge>('GET', '/api/captcha/challenge').then(({ body: challenge }) => {
    return cy.request<{ token: string }>('POST', '/api/captcha/verify', {
      id: challenge.id,
      seal: challenge.seal,
      angle: challenge.targetAngle,
      durationMs: 600
    }).then(({ body }) => body.token)
  })
})

Cypress.Commands.add('loginAsTenant', (email?: string, password?: string) => {
  const userEmail = email || Cypress.env('tenantEmail') || 'owner@midesk.test'
  const userPassword = password || Cypress.env('tenantPassword') || 'password'

  return cy.getCaptchaToken().then((captchaToken) => {
    cy.request('POST', '/api/v1/auth/login', {
      email: userEmail,
      password: userPassword,
      captchaToken
    }).then(({ body }) => {
      const token = body.token || body.data?.token
      expect(token, 'tenant auth token').to.be.a('string')
      cy.setCookie('midesk_token', token)
    })
  })
})

Cypress.Commands.add('loginAsSuperAdmin', (email?: string, password?: string) => {
  const saEmail = email || Cypress.env('superAdminEmail') || 'superadmin@midesk.io'
  const saPassword = password || Cypress.env('superAdminPassword') || 'superadmin'

  cy.request('POST', '/api/v1/super-admin/auth/login', {
    email: saEmail,
    password: saPassword
  }).then(({ body }) => {
    expect(body.token, 'super-admin token').to.be.a('string')
    cy.setCookie('midesk_sa_token', body.token)
  })
})

export {}
