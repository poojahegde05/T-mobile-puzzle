import {
  async,
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick
} from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedTestingModule } from '@tmo/shared/testing';

import { BooksFeatureModule } from '../books-feature.module';
import { BookSearchComponent } from './book-search.component';
import { clearSearch, searchBooks } from '@tmo/books/data-access';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

describe('Book Search Component', () => {
  let component: BookSearchComponent;
  let fixture: ComponentFixture<BookSearchComponent>;
  let store: MockStore;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BooksFeatureModule, NoopAnimationsModule, SharedTestingModule],
      providers: [provideMockStore()]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookSearchComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  describe('Handle instant search change', () => {
    it('should dispatch an action as on typing on the form control considering debounce time', fakeAsync(() => {
      component.searchForm.setValue({ term: 'java' });
      tick(300);
      expect(store.dispatch).not.toHaveBeenCalled();
      component.searchForm.setValue({ term: 'javac' });
      tick(500);
      expect(store.dispatch).toHaveBeenCalledWith(searchBooks({ term: 'javac' }));
    }));

    it('should not dispatch searchBooks action when search field is not changed after 500 ms debounce', fakeAsync(() => {
      component.searchForm.setValue({ term: 'java' });
      tick(500);
      expect(store.dispatch).toHaveBeenCalledWith(
        searchBooks({ term: 'java' })
      );

      component.searchForm.setValue({ term: 'javas' });
      component.searchForm.setValue({ term: 'java' });
      tick(500);
      expect(store.dispatch).toHaveBeenCalledWith(
        searchBooks({ term: 'java' })
      );
    }));

    it('should dispatch clearSearch action when search term is changed and is empty', fakeAsync(() => {
      component.searchForm.setValue({ term: '' });
      tick(500);
      expect(store.dispatch).toHaveBeenCalledWith(clearSearch());
    }));
  });
});