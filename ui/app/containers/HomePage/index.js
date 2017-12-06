import Header from 'components/Header';
import React from 'react';

export default class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <Header />
      </div>
    );
  }
}
