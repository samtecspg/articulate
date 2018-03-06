import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import Header from 'components/Header';
import Content from '../../components/Content';
import ContentHeader from '../../components/ContentHeader';
import ActionButton from '../../components/ActionButton';
import React from 'react';
import messages from './messages';
import { push } from 'react-router-redux';
import { resetStatusFlags, loadAgents } from '../App/actions';

export class WizardDomainPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount(){
    this.props.onComponentMounted();
  }

  render() {

    return (
      <div>
        <Header breadcrumbs={[{ label: 'Welcome: Getting Started' }]} actionButtons={
          <ActionButton label={messages.actionButton} onClick={this.props.onCreateAgent} />} />
        <Content>
          <ContentHeader title={messages.welcomeTitle} subTitle={messages.welcomeDescription} />
        </Content>
      </div>
    );
  }
}

WizardDomainPage.propTypes = {
  onCreateAgent: React.PropTypes.func,
  onComponentMounted: React.PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    onCreateAgent: (evt) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(push('/domains/create'));
    },
    onComponentMounted: () => {
      dispatch(loadAgents());
      dispatch(resetStatusFlags());
    },
  };
}

const mapStateToProps = createStructuredSelector({});

export default connect(mapStateToProps, mapDispatchToProps)(WizardDomainPage);
