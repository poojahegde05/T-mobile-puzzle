describe('When: I use the reading list feature', () => {
  beforeEach(() => {
    cy.startAt('/');
  });

  it('Then: I should see my reading list', () => {
    cy.get('[data-testing="toggle-reading-list"]').click();

    cy.get('[data-testing="reading-list-container"]').should(
      'contain.text',
      'My Reading List'
    );
  });
});
describe('When: I use the reading list feature', () => {
  beforeEach(() => {
    cy.startAt('/');
    cy.get('input[type="search"]').type('javascript');
    cy.get('form').submit();
    cy.get('[data-testing="book-item"]').should('have.length.greaterThan', 0);
  });

  it('Then: I should see my reading list', () => {
    cy.get('[data-testing="toggle-reading-list"]').click();

    cy.get('[data-testing="reading-list-container"]').should(
      'contain.text',
      'My Reading List'
    );
  });

  it('Then: I should be able to mark book as finished and remove finished book from reading list side nav', () => {
    removeItemsFromReadingList();
    cy.get('[data-testing="want-to-read-btn"]').first().click({ multiple: true, force: true });
    cy.get('[data-testing="reading-list-item"]').should('have.length', 1);

    cy.get('[data-testing="toggle-reading-list"]').click({ multiple: true, force: true });
    cy.get('[data-testing="finished-btn"]').first().click({ multiple: true, force: true });

    // we need to verify if finished button and finished date are displayed when book is marked as done
    cy.get('[data-testing="reading-list-item"]').within(() => {
      cy.get('[data-testing="finished-btn"]').should('be.visible');
      cy.get('[data-testing="finished-date"]').should('be.visible');
    });

    // we need to verify if want to read button disabled and text changed to "Finished" when book is marked as done,should be shown in automation testing
    cy.get('[data-testing="toggle-reading-list"]').click({ multiple: true, force: true });
    cy.get('[data-testing="want-to-read-btn"]')
      .first()
      .should('be.disabled')
      .should('contain.text', 'Finished');

    cy.get('[data-testing="remove-btn"]').first().click({ multiple: true, force: true });

    // we need to verify if want to read button enabled and text changed to "Want to Read" when finished book removed from reading list side nav,should be shown in automation testing
    cy.get('[data-testing="want-to-read-btn"]')
      .first()
      .should('be.enabled')
      .should('contain.text', 'Want to Read');
  });
});

function removeItemsFromReadingList() {
  cy.get('[data-testing="toggle-reading-list"]').click();
  cy.get('[data-testing="reading-list-container"]').then(container => {
    container.find('[data-testing="remove-btn"]').trigger('click');
  });
  cy.get('[data-testing="close-btn"]').click();
}