/**
 * Test the AgentPage
 */

import ReposList from 'components/ReposList';
import {
  mount,
  shallow,
} from 'enzyme';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { loadRepos } from '../../App/actions';
import { changeUsername } from '../actions';
import {
  AgentPage,
  mapDispatchToProps,
} from '../index';

describe('<AgentPage />', () => {
  it('should render the repos list', () => {
    const renderedComponent = shallow(
      <AgentPage loading error={false} repos={[]} />,
    );
    expect(renderedComponent.contains(<ReposList loading error={false} repos={[]} />)).toEqual(true);
  });

  it('should render fetch the repos on mount if a username exists', () => {
    const submitSpy = jest.fn();
    mount(
      <IntlProvider locale="en">
        <AgentPage
          username="Not Empty"
          onChangeUsername={() => {
          }}
          onSubmitForm={submitSpy}
        />
      </IntlProvider>,
    );
    expect(submitSpy).toHaveBeenCalled();
  });

  describe('mapDispatchToProps', () => {
    describe('onChangeUsername', () => {
      it('should be injected', () => {
        const dispatch = jest.fn();
        const result = mapDispatchToProps(dispatch);
        expect(result.onChangeUsername).toBeDefined();
      });

      it('should dispatch changeUsername when called', () => {
        const dispatch = jest.fn();
        const result = mapDispatchToProps(dispatch);
        const username = 'mxstbr';
        result.onChangeUsername({ target: { value: username } });
        expect(dispatch).toHaveBeenCalledWith(changeUsername(username));
      });
    });
  });

  describe('onSubmitForm', () => {
    it('should be injected', () => {
      const dispatch = jest.fn();
      const result = mapDispatchToProps(dispatch);
      expect(result.onSubmitForm).toBeDefined();
    });

    it('should dispatch loadRepos when called', () => {
      const dispatch = jest.fn();
      const result = mapDispatchToProps(dispatch);
      result.onSubmitForm();
      expect(dispatch).toHaveBeenCalledWith(loadRepos());
    });

    it('should preventDefault if called with event', () => {
      const preventDefault = jest.fn();
      const result = mapDispatchToProps(() => {
      });
      const evt = { preventDefault };
      result.onSubmitForm(evt);
      expect(preventDefault).toHaveBeenCalledWith();
    });
  });
});
