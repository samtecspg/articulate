import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import Header from 'components/Header';
import Content from '../../components/Content';
import ContentHeader from '../../components/ContentHeader';
import ActionButton from '../../components/ActionButton';
import React from 'react';
import messages from './messages';
import { push } from 'react-router-redux';
import { setInWizard } from '../App/actions';

export class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  render() {

    return (
      <div>
        <Header breadcrumbs={[{ label: 'Welcome: Getting Started' }]} actionButtons={<ActionButton key="CreateButton" label={messages.actionButton} onClick={this.props.onCreateAgent} />} />
        <Content>
          <ContentHeader title={messages.welcomeTitle} subTitle={messages.welcomeDescription} />
        </Content>
      </div>
    );
  }
}

HomePage.propTypes = {
  onCreateAgent: React.PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    onCreateAgent: (evt) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(setInWizard(true))
      dispatch(push('/agents/create'));
    }
  };
}

const mapStateToProps = createStructuredSelector({});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
