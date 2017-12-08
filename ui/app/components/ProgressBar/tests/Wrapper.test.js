import { shallow } from 'enzyme';
import React from 'react';

import Wrapper from '../Wrapper';

it('should render an <div> tag', () => {
  const renderedComponent = shallow(<Wrapper />);
  expect(renderedComponent.type()).toEqual('div');
});
