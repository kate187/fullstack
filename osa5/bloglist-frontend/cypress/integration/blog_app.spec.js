describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'test_user',
      username: 'test',
      password: 'test'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user)
    cy.visit('http://localhost:3000')
  })
  it('Login form shown', function() {
    cy.contains('login')
  })
  it('Login works with right creds', function() {
    cy.contains('login').click()
    cy.get('#username').type('test')
    cy.get('#password').type('test')
    cy.get('#login-button').click()
    cy.contains('test logged in')
  })
  it('Login rejected with wrong creds', function() {
    cy.contains('login').click()
    cy.get('#username').type('test')
    cy.get('#password').type('wrong')
    cy.get('#login-button').click()
    cy.contains('wrong credentials')
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.contains('login').click()
      cy.get('#username').type('test')
      cy.get('#password').type('test')
      cy.get('#login-button').click()
      cy.contains('test logged in')
    })

    it('A blog can be created', function() {
        cy.contains('test logged in')
        cy.contains('new blog').click()
        cy.get('#title').type('blog created by cypress')
        cy.get('#author').type('author')
        cy.get('#url').type('url')
        cy.contains('create').click()
        cy.contains('blog created by cypress')
    })
  })
  describe('When blog created', function() {
    beforeEach(function() {
      cy.contains('login').click()
      cy.get('#username').type('test')
      cy.get('#password').type('test')
      cy.get('#login-button').click()
      cy.contains('test logged in')
      cy.contains('new blog').click()
      cy.get('#title').type('blog created by cypress')
      cy.get('#author').type('author')
      cy.get('#url').type('url')
      cy.contains('create').click()
      cy.contains('blog created by cypress')
    })

    it('A blog can be liked', function() {
        cy.contains('like').click()
        cy.contains('view').click()
        cy.contains('likes 1')
    })
    
    it('blog can be deleted', function() {

        cy.on('window:confirm', (str) => {
          expect(str).to.eq('Are you sure?')
        })
        cy.contains('delete').click()
    })
   
  })

})
