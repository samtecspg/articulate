import React from 'react';
import Helmet from 'react-helmet';

import {
  Col,
  Row,
  Input
} from 'react-materialize';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import Alert from 'react-s-alert';
import { createStructuredSelector } from 'reselect';
import ActionButton from '../../components/ActionButton';
import ColorPicker from '../../components/ColorPicker';
import Content from '../../components/Content';
import ContentHeader from '../../components/ContentHeader';
import Form from '../../components/Form';
import FormTextInput from '../../components/FormTextInput';
import Header from '../../components/Header';
import InputLabel from '../../components/InputLabel';
import Preloader from '../../components/Preloader';
import Table from '../../components/Table';
import TableContainer from '../../components/TableContainer';
import TableHeader from '../../components/TableHeader';
import ConfirmationModal from '../../components/ConfirmationModal';

import {
  createEntity,
  resetStatusFlags
} from '../../containers/App/actions';
import {
  makeSelectCurrentAgent,
  makeSelectError,
  makeSelectInWizard,
  makeSelectLoading,
  makeSelectSuccess,
} from '../../containers/App/selectors';
import { updateEntity } from '../App/actions';
import {
  addExample,
  addSynonym,
  changeEntityData,
  closeColorPicker,
  loadEntity,
  removeExample,
  removeSynonym,
  resetEntityData,
  switchColorPickerDisplay
} from './actions';
import Examples from './Components/Examples';

import messages from './messages';
import {
  makeDisplayColorPicker,
  makeSelectEntityData,
  makeSelectTouched,
} from './selectors';

const returnFormattedOptions = (options) => options.map((option, index) => (
  <option key={index} value={option.value}>
    {option.text}
  </option>
));

export class EntityPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor() {
    super();
    this.onChangeInput = this.onChangeInput.bind(this);
    this.onAddExample = this.onAddExample.bind(this);
    this.setEditMode = this.setEditMode.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.routerWillLeave = this.routerWillLeave.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onLeave = this.onLeave.bind(this);
  }

  state = {
    editMode: false,
    displayModal: false,
    clickedSave: false,
    waitingForConfirm: false,
    nextRoute: null,
    lastExampleEdited: false,
  };

  componentDidMount() {
    this.setEditMode(this.props.route.name === 'entityEdit');
    this.props.router.setRouteLeaveHook(this.props.route, this.routerWillLeave);
    document.getElementById('entityName').focus();
  }

  componentWillMount() {
    const { currentAgent } = this.props;
    if (currentAgent) {
      this.props.onChangeEntityData('agent', currentAgent.agentName);
    }
  }

  componentWillUpdate(nextProps) {
    const { currentAgent } = nextProps;
    if (currentAgent !== this.props.currentAgent) {
      this.props.onChangeEntityData('agent', currentAgent.agentName);
    }
  }

  onChangeInput(evt, field) {
    this.props.onChangeEntityData(field, evt.target.value);
  }

  onAddExample(evt) {
    this.state.lastExampleEdited = true;
    this.props.onAddExample(evt);
  }

  componentDidUpdate(prevProps, prevState, prevContext) {
    if (this.props.route !== prevProps.route) {
      this.setEditMode(this.props.route.name === 'entityEdit');
    }
    if (this.props.success) {
      Alert.success(this.state.editMode ? messages.successMessageEdit.defaultMessage : messages.successMessage.defaultMessage, {
        position: 'bottom'
      });
      this.props.onSuccess.bind(null, this.props.inWizard)();
    }

    if (this.props.error) {
      Alert.error(this.props.error.message, {
        position: 'bottom'
      });
    }
    if (this.state.lastExampleEdited) {
      this.state.lastExampleEdited = false;
      this.scrollToBottom();
    }
  }

  scrollToBottom = () => {
    this.lastExample.scrollIntoView({ block: 'end', behavior: 'smooth' });
  };

  setEditMode(isEditMode) {
    if (isEditMode) {
      this.setState({ editMode: true });
      this.props.onEditMode(this.props.params.id);
    } else {
      this.props.resetForm();
      this.setState({ editMode: false });
      const { currentAgent } = this.props;
      if (currentAgent) {
        this.props.onChangeEntityData('agent', currentAgent.agentName);
      }
    }
  }

  submitForm(evt) {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    this.state.clickedSave = true;
    if (this.state.editMode) {
      this.props.onUpdate();
    } else {
      this.props.onCreate();
    }
  }

  routerWillLeave(route) {
    if (!this.state.waitingForConfirm && this.props.touched && !this.state.clickedSave) {
      this.state.nextRoute = route;
      this.state.displayModal = true;
      this.state.waitingForConfirm = true;
      this.forceUpdate();
      return false;
    }
  }

  onLeave() {
    this.props.resetForm();
    this.props.router.push(this.state.nextRoute.pathname);
  }

  onDismiss() {
    this.setState({
      displayModal: false,
      waitingForConfirm: false,
    });
  }

  render() {
    const { loading, error, success, entity, displayColorPicker, currentAgent } = this.props;
    const entityProps = {
      loading,
      error,
      success,
      entity,
      displayColorPicker,
    };

    let typeSelect = [];
    const defaultOptionType = { value: 'learned', text: 'Learned', disabled: 'disabled' };
    const regexOptionType = { value: 'regex', text: 'Regex', disabled: 'disabled' };

    typeSelect = [defaultOptionType, regexOptionType];

    let breadcrumbs = [
      { label: 'Agent' },
    ];
    if (currentAgent) {
      breadcrumbs.push({ link: `/agent/${currentAgent.id}`, label: `${currentAgent.agentName}` });
    }
    breadcrumbs.push({ link: `/entities`, label: 'Entities' });
    breadcrumbs.push({ label: `${this.state.editMode ? 'Edit' : '+ Create'}` });
    const contentHeaderTitle = this.state.editMode ? messages.editEntityTitle : messages.createEntityTitle;
    const contentHeaderSubTitle = this.state.editMode ? messages.editEntityDescription : messages.createEntityDescription;

    return (
      <div>
        <Col style={{ zIndex: 2, position: 'fixed', top: '50%', left: '45%' }} s={12}>
          {entityProps.loading ? <Preloader color='#00ca9f' size='big' /> : null}
        </Col>
        <Helmet
          title="Create Entity"
          meta={[
            { name: 'description', content: 'Create an entity' },
          ]}
        />
        <Header breadcrumbs={breadcrumbs} actionButtons={
          <ActionButton label={this.state.editMode ? messages.editButton : messages.createButton} onClick={this.submitForm} />
        } />
        <Content>
          <ContentHeader title={contentHeaderTitle} subTitle={contentHeaderSubTitle} />
          <Form>
            <Row>
              <FormTextInput
                id='entityName'
                label={messages.entityName}
                placeholder={messages.entityNamePlaceholder.defaultMessage}
                inputId="entityName"
                onChange={(evt) => this.onChangeInput(evt, 'entityName')}
                required
                s={10}
                value={entity.entityName}

              />

              <InputLabel s={2} text={messages.entityColor} />
              <ColorPicker
                color={entity.uiColor}
                handleClose={this.props.handleClose}
                handleClick={this.props.handleClick}
                handleColorChange={this.props.handleColorChange}
                displayColorPicker={this.props.displayColorPicker}
                s={2}
              />
              <Input
                s={12}
                type="select"
                label={messages.entityType.defaultMessage}
                value={entity.type ? entity.type : 'learned'}
                onChange={(evt) => this.onChangeInput(evt, 'type')}
              >
                {returnFormattedOptions(typeSelect)}
              </Input>
              {entity.type !== 'regex' ?
                <FormTextInput
                  id='regex'
                  label={messages.regex}
                  placeholder={messages.regexPlaceholder.defaultMessage}
                  inputId="regex"
                  onChange={(evt) => this.onChangeInput(evt, 'regex')}
                  s={12}
                  value={entity.regex}
                /> : null
              }
              {entity.type === 'regex' ? <InputLabel text={messages.regexValues} /> : <InputLabel text={messages.examples} />}

            </Row>
          </Form>

          <TableContainer id={'examplesTable'}>
            <Table>
              {entity.type === 'regex' ?
                <TableHeader
                  columns={
                    [
                      {
                        label: messages.valueColumn.regexMessage,
                        tooltip: messages.valueColumnTooltip.regexMessage,
                        width: '30%',
                      },
                      {
                        label: messages.synonymsColum.defaultMessage,
                        tooltip: messages.synonymsColumTooltip.regexMessage,
                        width: '70%',
                      },
                    ]}
                /> : <TableHeader
                  columns={
                    [
                      {
                        label: messages.valueColumn.defaultMessage,
                        tooltip: messages.valueColumnTooltip.defaultMessage,
                        width: '30%',
                      },
                      {
                        label: messages.synonymsColum.defaultMessage,
                        tooltip: messages.synonymsColumTooltip.defaultMessage,
                        width: '70%',
                      },
                    ]
                  }
                />
              }

              <Examples
                examples={entity.examples}
                addExampleFunction={(evt) => { this.onAddExample(evt) }}
                removeExampleFunction={this.props.onRemoveExample}
                removeSynonymFunction={this.props.onRemoveSynonym}
                addSynonymFunction={this.props.onAddSynonym}
              />
            </Table>
          </TableContainer>
          <br />
          <div
            ref={(el) => {
              this.lastExample = el;
            }}
          >
          </div>
        </Content>
        <ConfirmationModal
          isOpen={this.state.displayModal}
          onLeave={this.onLeave}
          onDismiss={this.onDismiss}
          contentBody='You have not saved your edits to this entity. If you leave you will lose your current work.'
        />
      </div>
    );
  }
}

EntityPage.propTypes = {
  loading: React.PropTypes.bool,
  error: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  entity: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  onChangeEntityData: React.PropTypes.func,
  onCreate: React.PropTypes.func,
  onUpdate: React.PropTypes.func,
  onRemoveExample: React.PropTypes.func,
  onAddExample: React.PropTypes.func,
  onRemoveSynonym: React.PropTypes.func,
  onAddSynonym: React.PropTypes.func,
  currentAgent: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  resetForm: React.PropTypes.func,
  onEditMode: React.PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    onChangeEntityData: (field, value) => {
      dispatch(dispatch(resetStatusFlags()));
      dispatch(changeEntityData({ value, field }));
    },
    onRemoveExample: (example, evt) => {
      dispatch(dispatch(resetStatusFlags()));
      dispatch(removeExample(example));
    },
    onAddExample: (evt) => {
      if (evt.keyCode === 13) {
        dispatch(dispatch(resetStatusFlags()));
        dispatch(addExample(evt.target.value));
        evt.target.value = null;
      }
    },
    onRemoveSynonym: (example, synonym, evt) => {
      dispatch(dispatch(resetStatusFlags()));
      dispatch(removeSynonym({ example, synonym }));
    },
    onAddSynonym: (exampleValue, evt) => {
      dispatch(dispatch(resetStatusFlags()));
      if (evt.keyCode === 13) {
        dispatch(addSynonym({ example: exampleValue, synonym: evt.target.value }));
        evt.target.value = null;
      }
    },
    onCreate: (inWizard) => {
      dispatch(createEntity());
    },
    onUpdate: () => {
      dispatch(updateEntity());
    },
    handleClick: () => {
      dispatch(dispatch(resetStatusFlags()));
      dispatch(switchColorPickerDisplay());
    },
    handleClose: () => {
      dispatch(dispatch(resetStatusFlags()));
      dispatch(closeColorPicker());
    },
    handleColorChange: (color) => {
      dispatch(dispatch(resetStatusFlags()));
      dispatch(changeEntityData({ value: color, field: 'uiColor' }));
    },
    resetForm: () => {
      dispatch(resetEntityData());
    },
    onSuccess: (inWizard) => {
      dispatch(resetStatusFlags());
      if (inWizard) {
        dispatch(push('/wizard/intent'));
      }
      else {
        dispatch(push('/entities'));
      }
    },
    onEditMode: (entityId) => {
      dispatch(loadEntity(entityId));
    },
  };
}

const mapStateToProps = createStructuredSelector({
  entity: makeSelectEntityData(),
  displayColorPicker: makeDisplayColorPicker(),
  loading: makeSelectLoading(),
  touched: makeSelectTouched(),
  error: makeSelectError(),
  success: makeSelectSuccess(),
  inWizard: makeSelectInWizard(),
  currentAgent: makeSelectCurrentAgent(),
});

export default connect(mapStateToProps, mapDispatchToProps)(EntityPage);
