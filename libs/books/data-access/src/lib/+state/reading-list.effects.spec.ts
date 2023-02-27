import { TestBed } from '@angular/core/testing';
import { ReplaySubject } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import {
  SharedTestingModule,
  createReadingListItem,
} from '@tmo/shared/testing';
import { ReadingListEffects } from './reading-list.effects';
import * as ReadingListActions from './reading-list.actions';
import { API_PATH } from '../constants';

describe('ToReadEffects', () => {
  let actions: ReplaySubject<any>;
  let effects: ReadingListEffects;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestingModule],
      providers: [
        ReadingListEffects,
        provideMockActions(() => actions),
        provideMockStore(),
      ],
    });

    effects = TestBed.inject(ReadingListEffects);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('loadReadingList$', () => {
    it('should work', done => {
      actions = new ReplaySubject();
      actions.next(ReadingListActions.init());

      effects.loadReadingList$.subscribe((action) => {
        expect(action).toEqual(
          ReadingListActions.loadReadingListSuccess({ list: [] })
        );
        done();
      });

      httpMock.expectOne(API_PATH.READING_LIST).flush([]);
    });
  });

  describe('markBookAsFinished$', () => {
    let item;
    beforeEach(() => {
      item = {
        ...createReadingListItem('A'),
        finished: true,
        finishedDate: '2021-03-03T00:00:00.000Z',
      };
    });

    it('should dispatch confirmedMarkBookAsFinished action when API returns success response', (done) => {
      actions = new ReplaySubject();
      actions.next(ReadingListActions.markBookAsFinished({ item }));
      effects.markBookAsFinished$.subscribe((action) => {
        expect(action).toEqual(
          ReadingListActions.confirmedMarkBookAsFinished({
            item,
          })
        );
        done();
      });

      httpMock
        .expectOne(`${API_PATH.READING_LIST}/A/finished`)
        .flush({ ...item });
    });

    it('should dispatch failedMarkBookAsFinished action when API returns failure response', done => {
      actions = new ReplaySubject();
      actions.next(ReadingListActions.markBookAsFinished({ item }));
      effects.markBookAsFinished$.subscribe(action => {
        expect(action).toEqual(
          ReadingListActions.failedMarkBookAsFinished({
            item,
          })
        );
        done();
      });

      httpMock
        .expectOne(`${API_PATH.READING_LIST}/A/finished`)
        .error(new ErrorEvent('HttpErrorResponse'), {
          status: 500,
          statusText: 'some error',
        });
    });
  });
});