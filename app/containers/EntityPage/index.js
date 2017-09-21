import React from 'react';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';

import TextInput from 'components/TextInput';
import DropdownInput from 'components/DropdownInput';
import Header from 'components/Header';
import ContentHeader from 'components/ContentHeader';
import InputWarning from 'components/InputWarning';
import Content from 'components/Content';
import Tooltip from 'components/Tooltip';

import { Input, Row, Icon, Chip, Tag } from 'react-materialize';

import messages from './messages';

import { createEntity, loadAgents } from 'containers/App/actions';
import { makeSelectCurrentAgent, makeSelectAgents, makeSelectEntity, makeSelectLoading, makeSelectError } from 'containers/App/selectors';

import { changeEntityData } from './actions';
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

const renderExamples = (examples, addExampleFunction, addSynonymFunction) => {
  const rows = examples.map( (example, exampleIndex) => {
    const synonyms = [<Row key="existingSynonyms">{
        example.synonyms.map( (synonym, synonymIndex) => {
        return (
          <Tag key={synonymIndex}>{synonym}</Tag>
        )
      })}
    </Row>]
    synonyms.push(
      <Row key="newSynonym">
        <div className="col s4">
          <TextInput
            placeholder={messages.synonymPlaceholder.defaultMessage}
            id={'example_'+exampleIndex+'_newSynonym'}
            onKeyPress={addSynonymFunction.bind(null, example.value)}
          />
        </div>
      </Row>
    )
    return (
      <tr key={exampleIndex} >
        <td>
          <Chip close={true}>
            {example.value}
          </Chip>
        </td>
        <td>
          {
            synonyms
          }
        </td>
      </tr>
    )
  });
  rows.push(
    (<tr key="newExample">
      <td>
        <div className="col s5">
          <TextInput
            placeholder={messages.examplePlaceholder.defaultMessage}
            id="newExample"
            onKeyPress={addExampleFunction}
            />
        </div>
      </td>
      <td> 
      </td>
    </tr>)
  );
  return rows;
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
        <div id="form-section">
          <Row>
            <Input s={12} 
              name='agent'
              type='select' 
              label={messages.agent.defaultMessage} 
              defaultValue={this.props.entityData.agent ? this.props.entityData.agent : 'default'}
              onChange={this.props.onChangeEntityData.bind(null, 'agent')}>
                  {returnFormattedOptions(agentsSelect)}
            </Input>
            <div className="input-field col s12">
              <TextInput
                label={messages.entityName}
                placeholder={messages.entityNamePlaceholder.defaultMessage}
                inputId="entityName"
                value={this.props.entityData.entityName}
                onChange={this.props.onChangeEntityData.bind(null, 'entityName')}
                required={true}
                />
              <InputWarning text="* Warning description here"/>
            </div>
          </Row>
        </div>

        <label htmlFor="examplesTable">
          Examples
        </label>
        <div id="examplesTable" className="row table-container">
            <div className="border-container ">
                <table className="bordered highlight">
                    <thead>
                        <tr>
                            <th>
                              Value
                              <Tooltip
                                tooltip="This is one instance of the entity you named upwards"
                                delay={50}
                                position="top"
                              >
                                <a>
                                  <Icon>help_outline</Icon>
                                </a>
                              </Tooltip>
                            </th>
                            <th>
                              Synonyms  
                              <Tooltip
                                tooltip="Synonyms will help the agent to recognize this example in several different ways"
                                delay={50}
                                position="top"
                              >
                                <a>
                                  <Icon>help_outline</Icon>
                                </a>
                              </Tooltip>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderExamples(this.props.entityData.examples, this.props.onAddExample, this.props.onAddSynonym)}
                    </tbody>
                </table>
            </div>
        </div>

        <div className="fixed-action-btn">
          <a className="btn-floating btn-large" onClick={this.props.onSubmitForm}>
          + Create
          </a>
        </div>

        
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
  onMessageAccepted: React.PropTypes.func,
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

export function mapDispatchToProps(dispatch, entityProps) {
  return {
    onComponentMounting: (evt) => {
      dispatch(loadAgents());
    },
    onChangeEntityData: (field, evt) => { 
      dispatch(changeEntityData({ value: evt.target.value, field }))
    },
    onAddExample: (evt) => { 
      if(evt.charCode === 13){
        dispatch(addExample(evt.target.value));
      }
    },
    onAddSynonym: (exampleValue, evt) => { 
      if(evt.charCode === 13){
        dispatch(addSynonym({ example: exampleValue, synonym: evt.target.value }));
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
