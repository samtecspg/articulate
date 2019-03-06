/**
 * Test route reducer
 */

import Immutable from 'seamless-immutable';
import { LOCATION_CHANGE } from 'react-router-redux';
import { routeReducer } from '../reducers';

describe('route reducer', () => {
  it('should return the initial state', () => {
    const initialState = { foo: 'bar' };
    expect(routeReducer(initialState, {})).toEqual(initialState);
  });

  it('should handle the location_change action correctly', () => {
    const state = Immutable({ location: 'somewhere' });
    const payload = 'elsewhere';
    const action = { type: LOCATION_CHANGE, payload };

    const expectedState = { location: payload };
    const resultState = routeReducer(state, action).toJS();
    expect(resultState).toEqual(expectedState);
  });
});
