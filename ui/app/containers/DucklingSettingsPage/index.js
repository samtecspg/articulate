import React from 'react';
import Helmet from 'react-helmet';

import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/json';
import 'brace/theme/terminal';

import {
  Col,
  Row,
} from 'react-materialize';

import { connect } from 'react-redux';
import Alert from 'react-s-alert';
import { createStructuredSelector } from 'reselect';

import ActionButton from '../../components/ActionButton';
import Content from '../../components/Content';
import ContentHeader from '../../components/ContentHeader';
import Form from '../../components/Form';

import FormTextInput from '../../components/FormTextInput';
import Header from '../../components/Header';
import Preloader from '../../components/Preloader';
import InputLabel from '../../components/InputLabel';

import {
  resetStatusFlags,
  updateSettings,
  loadSettings,
  changeSettingsData,
  resetSettingsData,
  removeSettingsFallback,
} from '../App/actions';
import {
  makeSelectError,
  makeSelectLoading,
  makeSelectSuccess,
  makeSelectSettingsData,
} from '../App/selectors';

import messages from './messages';

export class DucklingSettingsPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor() {
    super();
    this.onChangeInput = this.onChangeInput.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  onChangeInput(evt, field) {
    if (['ducklingDimension'].indexOf(field) > -1){
      try {
        const value = JSON.parse(evt); //Ace editor send the value directly to the method as an string
        this.props.onChangeDucklingSettingsData({ value, field });
      } catch(e) {
        const value = evt; //Given the parse of the json failed store the value in the state as a string
        this.props.onChangeDucklingSettingsData({ value, field });
      }
    }
    else{
      const value = evt.target.value;
      this.props.onChangeDucklingSettingsData({ value , field });
    }
  }

  componentWillMount(){
    this.props.onComponentWillMount();
  }

  componentDidUpdate() {
    if (this.props.success) {
      Alert.success(messages.successMessageEdit.defaultMessage, {
        position: 'bottom'
      });
      this.props.onSuccess();
    }

    if (this.props.error) {
      Alert.error(this.props.error.message, {
        position: 'bottom'
      });
    }
  }

  submitForm(evt) {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    if(Array.isArray(this.props.ducklingSettings.ducklingDimension)){
      this.props.onUpdate();
    }
    else {
      Alert.warning(messages.ducklingDimensionWarningMessage.defaultMessage, {
        position: 'bottom'
      });
    }
  }

  render() {
    const { loading, error, success, ducklingSettings } = this.props;
    const ducklingSettingsProps = {
      loading,
      success,
      error,
      ducklingSettings,
    };

    let breadcrumbs = [
      { label: 'Settings' },
      { label: 'Duckling' },
    ];
    const contentHeaderTitle = messages.ducklingSettingsTitle;
    const contentHeaderSubTitle = messages.ducklingSettingsDescription;
    return (
      <div>
        <Col style={{ zIndex: 2, position: 'fixed', top: '50%', left: '45%' }} s={12}>
          {ducklingSettingsProps.loading ? <Preloader color='#00ca9f' size='big' /> : null}
        </Col>
        <Helmet
          title={'Duckling Setttings'}
          meta={[
            { name: 'description', content: 'View/Edit your duckling settings' },
          ]}
        />
        <Header breadcrumbs={breadcrumbs} actionButtons={
          <ActionButton label={messages.updateSettingsButton} onClick={this.submitForm} />} />
        <Content>
          <ContentHeader title={contentHeaderTitle} subTitle={contentHeaderSubTitle} />
          <Form>
            <Row>
              <FormTextInput
                id='ducklingURL'
                label={messages.ducklingURL}
                placeholder={messages.ducklingURLPlaceholder.defaultMessage}
                value={ducklingSettings.ducklingURL}
                onChange={(evt) => this.onChangeInput(evt, 'ducklingURL')}
                required
              />
              <InputLabel tooltip={messages.ducklingDimensionTooltip.defaultMessage} text={messages.ducklingDimension} />
              <AceEditor
                style={{marginBottom: '20px'}}
                width="100%"
                height="300px"
                mode="json"
                theme="terminal"
                name="ducklingDimension"
                readOnly={false}
                onChange={(value) => this.onChangeInput(value, 'ducklingDimension')}
                fontSize={14}
                showPrintMargin={true}
                showGutter={true}
                highlightActiveLine={true}
                value={typeof ducklingSettings.ducklingDimension === 'string' ?
                        ducklingSettings.ducklingDimension :
                        JSON.stringify(ducklingSettings.ducklingDimension, null, 2)}
                setOptions={{
                  useWorker: true,
                  showLineNumbers: true,
                  tabSize: 2,
                }} />
            </Row>
          </Form>
        </Content>
      </div>
    );
  }
}

DucklingSettingsPage.propTypes = {
  loading: React.PropTypes.bool,
  error: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  ducklingSettings: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  onChangeDucklingSettingsData: React.PropTypes.func,
  onUpdate: React.PropTypes.func,
  currentAgent: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  onSuccess: React.PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {

    onChangeDucklingSettingsData: (data) => {
      dispatch(resetStatusFlags());
      dispatch(changeSettingsData(data));
    },
    onUpdate: () => {
      dispatch(updateSettings());
    },
    onSuccess: () => {
      dispatch(resetStatusFlags());
    },
    onComponentWillMount: () => {
      dispatch(resetSettingsData());
      dispatch(loadSettings());
    },
    onRemoveFallback: (fallbackIndex) => {
      dispatch(removeSettingsFallback(fallbackIndex));
    }
  };
}

const mapStateToProps = createStructuredSelector({
  ducklingSettings: makeSelectSettingsData(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
  success: makeSelectSuccess(),
});

export default connect(mapStateToProps, mapDispatchToProps)(DucklingSettingsPage);
