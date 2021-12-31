describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.request(
      'POST', 'http://localhost:3003/api/users',
      { username: 'test-account', name: 'Test Account', password: 'salis' }
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
      cy.get('#username').type('test-account')
      cy.get('#password').type('salis')
      cy.get('#login-button').click()
      cy.contains('Test Account logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('test-account')
      cy.get('#password').type('salis2')
      cy.get('#login-button').click()
      cy.get('.error').contains('wrong username or password')
      cy.get('html').should('not.contain', 'Test Account logged in')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'test-account', password: 'salis' })
    })

    it('A blog can be created', function() {
      cy.contains('Create new blog').click()
      cy.get('#title').type('Hieno blogi!')
      cy.get('#author').type('Matti')
      cy.get('#url').type('www.blogit.com')
      cy.get('#create-blog-button').click()
      cy.get('#blog-list').contains('Hieno blogi!')
    })

    it('A blog can be liked', function() {
      cy.createBlog({ title: 'Paras blogi!', author: 'Mikko', url: 'sankari.fi' })
      cy.get('#blog-list').contains('Paras blogi!').contains('view').click()
      cy.get('#blog-list').contains('Paras blogi!').contains('likes 0')
      cy.get('#blog-list').contains('Paras blogi!').contains('like').click()
      cy.get('#blog-list').contains('Paras blogi!').contains('likes 1')
    })

    it('A blog can be removed', function() {
      cy.createBlog({ title: 'Paras blogi!', author: 'Mikko', url: 'sankari.fi' })
      cy.get('#blog-list').contains('Paras blogi!').contains('view').click()
      cy.get('#blog-list').contains('Paras blogi!').contains('remove').click()
      cy.get('.success').contains('Blog \'Paras blogi!\' by Mikko removed')
      cy.get('#blog-list').should('not.contain', 'Paras blogi!')
    })

    it('Blogs are sorted', function() {
      cy.createBlog({ title: 'a-blog', author: 'Mikko', url: 'sankari.fi' })
      cy.createBlog({ title: 'b-blog', author: 'Mikko', url: 'sankari.fi' })
      cy.createBlog({ title: 'c-blog', author: 'Mikko', url: 'sankari.fi' })

      cy.get('#blog-list').contains('a-blog').as('aBlog')
      cy.get('#blog-list').contains('b-blog').as('bBlog')
      cy.get('#blog-list').contains('c-blog').as('cBlog')

      // open view to show like button
      cy.get('@aBlog').contains('view').click()
      cy.get('@bBlog').contains('view').click()
      cy.get('@cBlog').contains('view').click()

      // a-blog 2 likes, b-blog 1 like and c-blog 0 likes
      cy.get('@aBlog').contains('like').click()
      cy.get('@aBlog').contains('likes 1')
      cy.get('@aBlog').contains('like').click()
      cy.get('@aBlog').contains('likes 2')

      cy.get('@bBlog').contains('like').click()
      cy.get('@bBlog').contains('likes 1')

      cy.get('#blog-list>div').eq(0).should('contain', 'a-blog')
      cy.get('#blog-list>div').eq(1).should('contain', 'b-blog')
      cy.get('#blog-list>div').eq(2).should('contain', 'c-blog')
    })
  })
})
