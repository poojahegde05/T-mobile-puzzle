# Are there any problems or code smells in the app?

- __Resolved__: `book-search.component.html` =>We should replace the format date function as a native date pipe because the format date function is called when, change detection cycle is triggered, whereas a native date pipe is triggered when input data is modified.

- `book-search.component.html` => Responsive design is not handled for list of books.
- __Resolved__: `book-search.component.ts` => Memory leak: Unsubscribtion is  missing for subscription done on getAllBooks. Using async pipe instead of subscribing will allow you to access to data in the template without creating extra property. Angular automatically unsubscribes the observable on component destroy. This prevents the problem of orphan subscriptions and memory leaks. Also, we don't need to hold the subscription with extra property in the component.When we use async pipe here , an unsubscription is done when the component is destroyed.

- __Resolved__: `reading-list.reducer.spec.ts` => Test cases are failing

- __Resolved__: `books.reducer.ts` => Unused store property: "searchTerm" is updated from the reducer but is not referred anywhere in component/selector.

- __Resolved__: `reading-list.reducer.ts` => failedAddToReadingList & failedRemoveFromReadingList actions are not caught in the reducer. We need to handle failure of add/remove book API calls so we can revert the state for added/removed book else it will result in inaccurate data being displayed to the user.

- __Resolved__: `book-search.component.html, reading-list.component.html` => Better naming is required for loop variables in the HTML templates. Proper naming of the variables provides more readability to the code.

# Are there other improvements you would make to the app? What are they and why?

- There is no spinner while fetching books. It is good to show a spinner while fetching books, as network constraints might be there.- The pagination is not implemented, so only 10 books are fetched, currently matching the search criteria. Adding pagination would allow users to move through pages of book items and see more than 10 books. As an option for pagination, we can also add an infinite loading feature where users can scroll as per need to see more books.

- Provide an informational message to the user for, if books are not found for the specific search term.

- __Resolved__: `books.effects.ts, reading-list.effects.ts` => Constant is not used for API endpoints.

- __Resolved__: `book-search.component.html` => Rather than  interpolating coverUrl `<img src="{{ b.coverUrl }}" />`, we can use property binding on src attribute `<img [src]="b.coverUrl" />`. It seems  technically better.

- `book-search.component.html, reading-list.component.html` =>The css class naming does not follow standard, for e.g. book--title, book--content etc. If we are following the BEM(Block-Element-Modifier) naming convention, then ideally the book--title should be book__title as title is a div element inside, book block.

- `book-search.component.html, reading-list.component.html` =>Footers can be implemented for better cosmetic views.
# Accessibilities issues:

_All issues resolved_

## Lighthouse

- Buttons do not have an accessible name.
- Background and foreground colors do not have a sufficient contrast ratio.

## Issues found in Manual scan

- `book-search.component.html, reading-list.component.html` => We should provide an "alt" attribute for "img" elements and keep it's value empty("") so screenreaders can completely ignore it, as in our case the book image is only a decorative image and does not provide any valuable information to the user.

- `book-search.component.html` => We need to set an aria-label attribute for the "Want to Read" button with the book's name in it's value. This can help screen reader to inform users on which book's Want to Read button is focused on. Also, the "Want to Read" button keyboard focus should have better visibility.

- `app.component.html` => Close reading list button is only the icon button, so we should add an aria-label attribute to the button so it will help screenreaders to inform users. Also, close button keyboard focus should have better visibility.

- `reading-list.component.html` => Empty reading list text should have better visiblity.

- `book-search.component.html` => An example "JavaScript" link should be a button instead of an anchor tag as we are not using, href attribute or redirecting to any other page. We are only handling click to action to search books.

- `book-search.component.html` => Search button is an icon only button, so we should add an aria-label attribute to the button so it will help screenreaders to inform users. Also, we need to increase the search icon font size to provide better visibility and click area.