import React from 'react';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';

import TextInput from 'components/TextInput';
import Header from 'components/Header';
import ContentHeader from 'components/ContentHeader';
import Content from 'components/Content';
import Form from 'components/Form';
import FormTextInput from 'components/FormTextInput';
import InputLabel from 'components/InputLabel';
import ActionButton from 'components/ActionButton';
import TableContainer from 'components/TableContainer';
import Table from 'components/Table';
import TableHeader from 'components/TableHeader';
import TableBody from 'components/TableBody';
import Examples from './Components/Examples';

import { Input, Row } from 'react-materialize';

import messages from './messages';

import { createEntity, loadAgents } from 'containers/App/actions';
import { makeSelectCurrentAgent, makeSelectAgents, makeSelectEntity, makeSelectLoading, makeSelectError } from 'containers/App/selectors';

import { changeEntityData, removeExample, addExample, removeSynonym, addSynonym } from './actions';
import { makeSelectEntityData } from './selectors';

const returnFormattedOptions = (options) => {
  return options.map( (option, index) => {
    return (
        <option key={index} value={option.value}>
          {option.text}
        </option>
      )
  });
};

export class EntityPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    this.props.onComponentMounting();
  }

  render() {
    const { loading, error, entity, agents, currentAgent } = this.props;
    const entityProps = {
      loading,
      error,
      entity,
    };

    let agentsSelect = [];
    if(agents !== false){
      agentsSelect = agents.map( (agent) => {
        return {
          value: agent._id,
          text: agent.agentName,
        }
      });
      agentsSelect.unshift({ value: 'default', text: 'Please choose an agent to place your entity', disabled: 'disabled'});
    }

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
            <Input s={12} 
              name='agent'
              type='select' 
              label={messages.agent.defaultMessage} 
              defaultValue={this.props.entityData.agent ? this.props.entityData.agent : 'default'}
              onChange={this.props.onChangeEntityData.bind(null, 'agent')}>
                  {returnFormattedOptions(agentsSelect)}
            </Input>
            <FormTextInput
              label={messages.entityName}
              placeholder={messages.entityNamePlaceholder.defaultMessage}
              inputId="entityName"
              value={this.props.entityData.entityName}
              onChange={this.props.onChangeEntityData.bind(null, 'entityName')}
              required={true}
              />
            <InputLabel text={messages.examples}/>
          </Row>
        </Form>

        <TableContainer id={"examplesTable"}>
            <Table>
                <TableHeader columns={[
                  {
                    label: messages.valueColumn.defaultMessage,
                    tooltip: messages.valueColumnTooltip.defaultMessage,
                    width: '30%',
                  },
                  {
                    label: messages.synonymsColum.defaultMessage,
                    tooltip: messages.synonymsColumTooltip.defaultMessage,
                    width: '70%',
                  }
                ]} />
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
  onComponentMounting: React.PropTypes.func,
  onChangeEntityData: React.PropTypes.func,
  onSubmitForm: React.PropTypes.func,
  onRemoveExample: React.PropTypes.func,
  onAddExample: React.PropTypes.func,
  onRemoveSynonym: React.PropTypes.func,
  onAddSynonym: React.PropTypes.func,
  onSubmitForm: React.PropTypes.func,
  entityData: React.PropTypes.object,
  currentAgent: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  agents: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.bool,
  ]),
};

export function mapDispatchToProps(dispatch) {
  return {
    onComponentMounting: (evt) => {
      dispatch(loadAgents());
    },
    onChangeEntityData: (field, evt) => { 
      dispatch(changeEntityData({ value: evt.target.value, field }))
    },
    onRemoveExample: (example, evt) => {
      dispatch(removeExample(example));
    },
    onAddExample: (evt) => { 
      if(evt.charCode === 13){
        dispatch(addExample(evt.target.value));
        evt.target.value = null;
      }
    },
    onRemoveSynonym: (example, synonym, evt) => {
      dispatch(removeSynonym({ example, synonym }));
    },
    onAddSynonym: (exampleValue, evt) => { 
      if(evt.charCode === 13){
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
  agents: makeSelectAgents(),
  currentAgent: makeSelectCurrentAgent(),
});

export default connect(mapStateToProps, mapDispatchToProps)(EntityPage);
