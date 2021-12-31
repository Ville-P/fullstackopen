describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.request(
      'POST', 'http://localhost:3003/api/users',
      {username: "test-account", name: "Test Account", password: "salis"}
    )
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.get('#login-form')
    cy.get('#username')
    cy.get('#password')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type("test-account")
      cy.get('#password').type("salis")
      cy.get('#login-button').click()
      cy.contains("Test Account logged in")
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type("test-account")
      cy.get('#password').type("salis2")
      cy.get('#login-button').click()
      cy.get('.error').contains('wrong username or password')
      cy.get('html').should('not.contain', 'Test Account logged in')
    })
  })
})
