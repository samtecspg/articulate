import { defineMessages } from 'react-intl';

export default defineMessages({
  createEntityTitle: {
    id: 'containers.EntityPage.create_entity.title',
    defaultMessage: 'Creating New Entity',
  },
  createEntityDescription: {
    id: 'containers.EntityPage.create_entity.description',
    defaultMessage: 'Entities are elements in the text that your agent is going to recognized according to the training you give it.',
  },
  editEntityTitle: {
    id: 'containers.EntityPage.edit_entity.title',
    defaultMessage: 'Edit Entity',
  },
  editEntityDescription: {
    id: 'containers.EntityPage.edit_entity.description',
    defaultMessage: 'Entities are elements in the text that your agent is going to recognized according to the training you give it.',
  },
  agent: {
    id: 'containers.EntityPage.create_entity.agent',
    defaultMessage: 'Agent',
  },
  entityName: {
    id: 'containers.EntityPage.create_entity.entityName',
    defaultMessage: 'Entity Name',
  },
  entityType: {
    id: 'boilerplate.containers.EntityPage.create_entity.entityType',
    defaultMessage: 'Entity type',
  },
  entityColor: {
    id: 'containers.EntityPage.create_entity.entityColor',
    defaultMessage: 'Entity Color',
  },
  entityNamePlaceholder: {
    id: 'containers.EntityPage.create_entity.entity_name_placeholder',
    defaultMessage: 'Type a name here',
  },
  regex : {
    id: 'containers.EntityPage.create_entity.regex',
    defaultMessage: 'Regex matching'
  },
  regexPlaceholder: {
    id:  'containers.EntityPage.regex_placeholder',
    defaultMessage : 'Type a regex to help find this entity.'
  },
  examples: {
    id: 'containers.EntityPage.create_entity.examples',
    defaultMessage: 'Examples',
  },
  regexValues: {
    id: 'boilerplate.containers.EntityPage.create_entity.regex_values',
    defaultMessage: 'Regex values',
  },
  examplePlaceholder: {
    id: 'containers.EntityPage.create_entity.example_placeholder',
    defaultMessage: 'Add Value',
  },
  synonymPlaceholder: {
    id: 'containers.EntityPage.create_entity.synonym_placeholder',
    defaultMessage: 'Add Synonym',
  },
  createButton: {
    id: 'containers.EntityPage.create_entity.create_button',
    defaultMessage: '+ Create',
  },
  editButton: {
    id: 'containers.EntityPage.create_entity.edit_button',
    defaultMessage: '+ Update',
  },
  valueColumn: {
    id: 'containers.EntityPage.create_agent.value_column',
    defaultMessage: 'Value',
    regexMessage: 'Regex to match'
  },
  synonymsColum: {
    id: 'containers.EntityPage.create_agent.synonyms_colum',
    defaultMessage: 'Synonyms',
  },
  valueColumnTooltip: {
    id: 'containers.EntityPage.create_agent.value_column_tooltip',
    defaultMessage: 'An instance of the intent you named upwards',
    regexMessage: 'A regex to be matched (resolved value found in text will be set in slots.[entityName].original while its corresponding entity entry will be saved as slots.[entityName].value)',
  },
  synonymsColumTooltip: {
    id: 'containers.EntityPage.create_agent.synonyms_colum_tooltip',
    defaultMessage: 'Synonyms will help the agent to recognize this example in several different ways',
    regexMessage: 'If there are multiple matches for a non list slot, the last one found in the sentance will be kept in slots.[entityName].original while the corresponding entity entry to the left will be set in slots.[entityName].value ',
  },
  successMessage: {
    id: 'containers.EntityPage.create_agent.success_message',
    defaultMessage: 'Entity created',
  },
  successMessageEdit: {
    id: 'containers.EntityPage.create_agent.success_message',
    defaultMessage: 'Entity updated',
  },
});
