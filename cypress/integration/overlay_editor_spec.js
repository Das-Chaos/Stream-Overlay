describe('Overlay Editor', () => {
  beforeEach(() => {
    cy.visit('/login')
    cy.get('input[name=email]').type('test@example.com')
    cy.get('input[name=password]').type('password123')
    cy.get('button[type=submit]').click()
    cy.url().should('include', '/dashboard')
  })

  it('can add and manipulate overlay items', () => {
    cy.get('button').contains('Add Text').click()
    cy.get('.overlay-item').should('have.length', 1)

    cy.get('.overlay-item').first().click()
    cy.get('input#content').clear().type('Hello, World!')
    cy.get('input#x-position').clear().type('100')
    cy.get('input#y-position').clear().type('50')

    cy.get('button').contains('Add Image').click()
    cy.get('.overlay-item').should('have.length', 2)

    cy.get('.overlay-item').last().click()
    cy.get('input#size').clear().type('200')

    cy.get('button').contains('Remove').first().click()
    cy.get('.overlay-item').should('have.length', 1)
  })
})

