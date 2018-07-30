/*
 * RasaSettings Messages
 *
 * This contains all the text for the RasaSettings component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  rasaSettingDescription: {
    id: 'app.components.RasaSettings.rasaSettingDescription',
    defaultMessage: 'If you modify these values the global settings for Rasa will be overriden.'
  },
  rasaURL: {
    id: 'app.components.RasaSettings.rasaURL',
    defaultMessage: 'Rasa URL',
  },
  rasaURLPlaceholder: {
    id: 'app.components.RasaSettings.rasaURLPlaceholder',
    defaultMessage: 'Enter the URL of your rasa server',
  },
  domainClassifierPipeline: {
    id: 'app.components.RasaSettings.domainClassifierPipeline',
    defaultMessage: 'Domain Classifier Pipeline:',
  },
  intentClassifierPipeline: {
    id: 'app.components.RasaSettings.intentClassifierPipeline',
    defaultMessage: 'Intent Classifier Pipeline:',
  },
  entityClassifierPipeline: {
    id: 'app.components.RasaSettings.entityClassifierPipeline',
    defaultMessage: 'Entity Classifier Pipeline:',
  },
  spacyPretrainedEntities: {
    id: 'app.components.RasaSettings.spacyPretrainedEntities',
    defaultMessage: 'Spacy Entities:',
  },
  requiredField: {
    id: 'app.components.RasaSettings.requiredField',
    defaultMessage: '*Required'
  },
});
