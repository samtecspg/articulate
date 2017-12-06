import { defineMessages } from 'react-intl';

export default defineMessages({
  createEntityTitle: {
    id: 'boilerplate.containers.EntityPage.create_entity.title',
    defaultMessage: 'Creating New Entity',
  },
  createEntityDescription: {
    id: 'boilerplate.containers.EntityPage.create_entity.description',
    defaultMessage: 'Entities can be the inputs to intents. Let\'s say you have an intent "I want to order cheese pizza", ' +
    'cheese could be labeled with an entity name of "topping".',
  },
  agent: {
    id: 'boilerplate.containers.EntityPage.create_entity.agent',
    defaultMessage: 'Agent',
  },
  entityName: {
    id: 'boilerplate.containers.EntityPage.create_entity.entityName',
    defaultMessage: 'Entity Name',
  },
  entityNamePlaceholder: {
    id: 'boilerplate.containers.EntityPage.create_entity.entity_name_placeholder',
    defaultMessage: 'Type a name here',
  },
  examples: {
    id: 'boilerplate.containers.EntityPage.create_entity.examples',
    defaultMessage: 'Examples',
  },
  examplePlaceholder: {
    id: 'boilerplate.containers.EntityPage.create_entity.example_placeholder',
    defaultMessage: 'Add Value',
  },
  synonymPlaceholder: {
    id: 'boilerplate.containers.EntityPage.create_entity.synonym_placeholder',
    defaultMessage: 'Add Synonym',
  },
  actionButton: {
    id: 'boilerplate.containers.AgentPage.create_agent.action_button',
    defaultMessage: '+ Create',
  },
  valueColumn: {
    id: 'boilerplate.containers.AgentPage.create_agent.value_column',
    defaultMessage: 'Value',
  },
  synonymsColum: {
    id: 'boilerplate.containers.AgentPage.create_agent.synonyms_colum',
    defaultMessage: 'Synonyms',
  },
  valueColumnTooltip: {
    id: 'boilerplate.containers.AgentPage.create_agent.value_column_tooltip',
    defaultMessage: 'An instance of the intent you named upwards',
  },
  synonymsColumTooltip: {
    id: 'boilerplate.containers.AgentPage.create_agent.synonyms_colum_tooltip',
    defaultMessage: 'Synonyms will help the agent to recognize this example in several different ways',
  },
});
