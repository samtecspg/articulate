import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import Header from 'components/Header';
import Content from '../../components/Content';
import ContentHeader from '../../components/ContentHeader';
import ActionButton from '../../components/ActionButton';
import React from 'react';
import messages from './messages';
import { push } from 'react-router-redux';
import { resetStatusFlags, loadAgents, setInWizard } from '../App/actions';

export class WizardIntentPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount(){
    this.props.onComponentMounted();
  }

  render() {

    return (
      <div>
        <Header breadcrumbs={[{ label: 'Welcome: Getting Started' }]} actionButtons={
          <ActionButton label={messages.actionButtonIntent} onClick={this.props.onCreateIntent} />} />
        <Content>
          <ContentHeader title={messages.welcomeTitle} subTitle={messages.welcomeDescription} />
        </Content>
      </div>
    );
  }
}

WizardIntentPage.propTypes = {
  onCreateAgent: React.PropTypes.func,
  onComponentMounted: React.PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    onCreateIntent: (evt) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(setInWizard(false));
      dispatch(push('/intents/create'));
    },
    onComponentMounted: () => {
      dispatch(loadAgents());
      dispatch(resetStatusFlags());
    },
  };
}

const mapStateToProps = createStructuredSelector({});

export default connect(mapStateToProps, mapDispatchToProps)(WizardIntentPage);
