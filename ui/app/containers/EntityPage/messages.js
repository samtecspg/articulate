import { defineMessages } from 'react-intl';

export default defineMessages({
  createEntityTitle: {
    id: 'boilerplate.containers.EntityPage.create_entity.title',
    defaultMessage: 'Creating New Entity',
  },
  createEntityDescription: {
    id: 'boilerplate.containers.EntityPage.create_entity.description',
    defaultMessage: 'Entities are elements in the text that your agent is going to recognized according to the training you give it.',
  },
  editEntityTitle: {
    id: 'boilerplate.containers.EntityPage.edit_entity.title',
    defaultMessage: 'Edit Entity',
  },
  editEntityDescription: {
    id: 'boilerplate.containers.EntityPage.edit_entity.description',
    defaultMessage: 'Entities are elements in the text that your agent is going to recognized according to the training you give it.',
  },
  agent: {
    id: 'boilerplate.containers.EntityPage.create_entity.agent',
    defaultMessage: 'Agent',
  },
  entityName: {
    id: 'boilerplate.containers.EntityPage.create_entity.entityName',
    defaultMessage: 'Entity Name',
  },
  entityType: {
    id: 'boilerplate.containers.EntityPage.create_entity.entityType',
    defaultMessage: 'Entity type',
  },
  entityColor: {
    id: 'boilerplate.containers.EntityPage.create_entity.entityColor',
    defaultMessage: 'Entity Color',
  },
  entityNamePlaceholder: {
    id: 'boilerplate.containers.EntityPage.create_entity.entity_name_placeholder',
    defaultMessage: 'Type a name here',
  },
  regex : {
    id : 'boilerplate.containers.EntityPage.create_entity.regex',
    defaultMessage: 'Regex matching'
  },
  regexPlaceholder: {
    id :  'boilerplate.containers.EntityPage.regex_placeholder',
    defaultMessage : 'Type a regex to help find this entity.'
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
  createButton: {
    id: 'boilerplate.containers.EntityPage.create_entity.create_button',
    defaultMessage: '+ Create',
  },
  editButton: {
    id: 'boilerplate.containers.EntityPage.create_entity.edit_button',
    defaultMessage: '+ Update',
  },
  valueColumn: {
    id: 'boilerplate.containers.EntityPage.create_agent.value_column',
    defaultMessage: 'Value',
  },
  synonymsColum: {
    id: 'boilerplate.containers.EntityPage.create_agent.synonyms_colum',
    defaultMessage: 'Synonyms',
  },
  valueColumnTooltip: {
    id: 'boilerplate.containers.EntityPage.create_agent.value_column_tooltip',
    defaultMessage: 'An instance of the intent you named upwards',
  },
  synonymsColumTooltip: {
    id: 'boilerplate.containers.EntityPage.create_agent.synonyms_colum_tooltip',
    defaultMessage: 'Synonyms will help the agent to recognize this example in several different ways',
  },
  successMessage: {
    id: 'boilerplate.containers.EntityPage.create_agent.success_message',
    defaultMessage: 'Entity created',
  },
  successMessageEdit: {
    id: 'boilerplate.containers.EntityPage.create_agent.success_message',
    defaultMessage: 'Entity updated',
  },
});
