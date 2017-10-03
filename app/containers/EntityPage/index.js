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
import Chip from 'components/Chip';

import { Input, Row, Icon } from 'react-materialize';

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

const renderExamples = (examples, removeExampleFunction, addExampleFunction, removeSynonymFunction, addSynonymFunction) => {
  const rows = examples.map( (example, exampleIndex) => {
    const synonyms = example.synonyms.map( (synonym, indexSynonym) => {
      return (
        <Chip onClose={removeSynonymFunction.bind(null, example.value, synonym)} key={indexSynonym} id={example.value + '_' + synonym} close={true}>
          {synonym}
        </Chip>
      )
    });
    synonyms.push(
      <TextInput
        key = {example.value + '_newSynonym'}
        placeholder={messages.synonymPlaceholder.defaultMessage}
        inputId={example.value + '_newSynonym'}
        onKeyPress={addSynonymFunction.bind(null, example.value)}
        />
    )
    return (
      <tr style={{width: '100%'}} key={exampleIndex} >
        <td style={{width: '30%', display: 'inline-block'}}>
          <Chip onClose={removeExampleFunction.bind(null, example.value)} id={example.value}close={true}>
            {example.value}
          </Chip>
        </td>
        <td style={{width: '70%', display: 'inline-block'}}>
            {
              synonyms
            }
        </td>
      </tr>
    )
  });
  rows.push(
    (<tr style={{width: '100%'}} key="newExample">
      <td style={{width: '30%', display: 'inline-block'}}>
        <TextInput
          placeholder={messages.examplePlaceholder.defaultMessage}
          inputId="newExample"
          onKeyPress={addExampleFunction}
          />
      </td>
      <td style={{width: '70%', display: 'inline-block'}}> 
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
            <div className="col input-field s12">
                <label><FormattedMessage {...messages.examples} /></label>
            </div>
          </Row>
        </div>

        <div id="examplesTable" className="table-container">
          <Row>
            <div className="col input-field s12 table-col">
              <div>
                <div className="border-container ">
                    <table className="bordered highlight">
                        <thead>
                            <tr style={{width: '100%'}}>
                                <th style={{width: '30%', display: 'inline-block'}}>
                                  Value
                                  <Tooltip
                                    tooltip="This is one instance of the intent you named upwards"
                                    delay={50}
                                    position="top"
                                  >
                                    <a>
                                      <Icon>help_outline</Icon>
                                    </a>
                                  </Tooltip>
                                </th>
                                <th style={{width: '70%', display: 'inline-block'}}>
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
                            {renderExamples(this.props.entityData.examples, this.props.onRemoveExample, this.props.onAddExample, this.props.onRemoveSynonym, this.props.onAddSynonym)}
                        </tbody>
                    </table>
                </div>
              </div>
            </div>
          </Row>
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
