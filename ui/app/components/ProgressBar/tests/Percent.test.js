import { shallow } from 'enzyme';
import React from 'react';

import Percent from '../Percent';

it('should render an <div> tag', () => {
  const renderedComponent = shallow(<Percent />);
  expect(renderedComponent.type()).toEqual('div');
});
