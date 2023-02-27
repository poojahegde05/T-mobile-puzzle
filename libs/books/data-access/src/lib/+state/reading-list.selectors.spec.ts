import * as ReadingListActions from './reading-list.actions';
import {
  initialState,
  readingListAdapter,
  reducer,
  State
} from './reading-list.reducer';
import { createBook, createReadingListItem } from '@tmo/shared/testing';

describe('Books Reducer', () => {
  describe('valid Books actions', () => {
    let state: State;

    beforeEach(() => {
      state = readingListAdapter.setAll(
        [createReadingListItem('A'), createReadingListItem('B')],
        initialState
      );
    });

    it('loadBooksSuccess should load books from reading list', () => {
      const list = [
        createReadingListItem('A'),
        createReadingListItem('B'),
        createReadingListItem('C')
      ];
      const action = ReadingListActions.loadReadingListSuccess({ list });

      const result: State = reducer(initialState, action);

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toEqual(3);
    });

    it('failedAddToReadingList should undo book addition to the state', () => {
      const action = ReadingListActions.failedAddToReadingList({
        book: createBook('B')
      });

      const result: State = reducer(state, action);

      expect(result.ids).toEqual(['A']);
    });

    it('failedRemoveFromReadingList should undo book removal from the state', () => {
      const action = ReadingListActions.failedRemoveFromReadingList({
        item: createReadingListItem('C')
      });

      const result: State = reducer(state, action);

      expect(result.ids).toEqual(['A', 'B', 'C']);
    });

    it('markBookAsFinished should update finished and finishedDate fields for item in the reading list', () => {
      const item = {
        ...createReadingListItem('A'),
        finished: true,
        finishedDate: '2021-03-03T00:00:00.000Z'
      };
      const action = ReadingListActions.markBookAsFinished({
        item
      });

      const result: State = reducer(state, action);
      expect(result.entities['A']).toEqual({
        ...item,
        finished: true,
        finishedDate: '2021-03-03T00:00:00.000Z'
      });
    });

    it('failedMarkBookAsFinished should reset finished and finishedDate fields for item in the reading list', () => {
      const item = {
        ...createReadingListItem('A'),
        finished: true,
        finishedDate: '2022-02-03T00:00:00.000Z'
      };
      const action = ReadingListActions.failedMarkBookAsFinished({
        item
      });

      const result: State = reducer(state, action);
      expect(result.entities['A']).toEqual({
        ...item,
        finished: false,
        finishedDate: undefined
      });
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toEqual(initialState);
    });
  });
});