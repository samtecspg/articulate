import { changeUsername, } from '../actions';
import { CHANGE_USERNAME, } from '../constants';

describe('Home Actions', () => {
  describe('changeUsername', () => {
    it('should return the correct type and the passed name', () => {
      const fixture = 'Max';
      const expectedResult = {
        type: CHANGE_USERNAME,
        name: fixture,
      };

      expect(changeUsername(fixture)).toEqual(expectedResult);
    });
  });
});
