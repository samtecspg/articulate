import React from 'react';
import Helmet from 'react-helmet';

import { Row, } from 'react-materialize';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import ActionButton from '../../components/ActionButton';
import Content from '../../components/Content';
import ContentHeader from '../../components/ContentHeader';
import Form from '../../components/Form';
import FormTextInput from '../../components/FormTextInput';
import Header from '../../components/Header';
import InputLabel from '../../components/InputLabel';
import Table from '../../components/Table';
import TableContainer from '../../components/TableContainer';
import TableHeader from '../../components/TableHeader';
import { createEntity, } from '../../containers/App/actions';
import {
  makeSelectCurrentAgent,
  makeSelectEntity,
  makeSelectError,
  makeSelectLoading,
} from '../../containers/App/selectors';

import {
  addExample,
  addSynonym,
  changeEntityData,
  removeExample,
  removeSynonym,
} from './actions';
import Examples from './Components/Examples';

import messages from './messages';
import { makeSelectEntityData } from './selectors';

export class EntityPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor() {
    super();
    this.onChangeInput = this.onChangeInput.bind(this);
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

  render() {
    const { loading, error, entity } = this.props;
    const entityProps = {
      loading,
      error,
      entity,
    };

    return (
      <div>
        <Helmet
          title="Create Entity"
          meta={[
            { name: 'description', content: 'Create an entity' },
          ]}
        />
        <Header />
        <Content>
          <ContentHeader title={messages.createEntityTitle} subTitle={messages.createEntityDescription} />
          <Form>
            <Row>
              <FormTextInput
                label={messages.entityName}
                placeholder={messages.entityNamePlaceholder.defaultMessage}
                inputId="entityName"
                onChange={(evt) => this.onChangeInput(evt, 'entityName')}
                required
              />
              <InputLabel text={messages.examples} />
            </Row>
          </Form>

          <TableContainer id={'examplesTable'}>
            <Table>
              <TableHeader
                columns={[
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
                ]}
              />
              <Examples
                examples={this.props.entityData.examples}
                addExampleFunction={this.props.onAddExample}
                removeExampleFunction={this.props.onRemoveExample}
                removeSynonymFunction={this.props.onAddExample}
                addSynonymFunction={this.props.onAddSynonym}
              />
            </Table>
          </TableContainer>

          <ActionButton label={messages.actionButton} onClick={this.props.onSubmitForm} />

          <Row>
            <p>
              {JSON.stringify(entityProps)}
            </p>
          </Row>
        </Content>
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
  onSubmitForm: React.PropTypes.func,
  onRemoveExample: React.PropTypes.func,
  onAddExample: React.PropTypes.func,
  onRemoveSynonym: React.PropTypes.func,
  onAddSynonym: React.PropTypes.func,
  entityData: React.PropTypes.object,
  currentAgent: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
};

export function mapDispatchToProps(dispatch) {
  return {
    onChangeEntityData: (field, value) => {
      dispatch(changeEntityData({ value, field }));
    },
    onRemoveExample: (example, evt) => {
      dispatch(removeExample(example));
    },
    onAddExample: (evt) => {
      if (evt.charCode === 13) {
        dispatch(addExample(evt.target.value));
        evt.target.value = null;
      }
    },
    onRemoveSynonym: (example, synonym, evt) => {
      dispatch(removeSynonym({ example, synonym }));
    },
    onAddSynonym: (exampleValue, evt) => {
      if (evt.charCode === 13) {
        dispatch(addSynonym({ example: exampleValue, synonym: evt.target.value }));
        evt.target.value = null;
      }
    },
    onSubmitForm: (evt) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(createEntity());
    },
  };
}

const mapStateToProps = createStructuredSelector({
  entity: makeSelectEntity(),
  entityData: makeSelectEntityData(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
  currentAgent: makeSelectCurrentAgent(),
});

export default connect(mapStateToProps, mapDispatchToProps)(EntityPage);
