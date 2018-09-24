/*
 * RasaSettings Messages
 *
 * This contains all the text for the RasaSettings component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  rasaSettingDescription: {
    id: 'app.components.RasaSettings.rasaSettingDescription',
    defaultMessage: 'You can configure the address of your rasa instance and the desired pipelines you would like for your models. This values are overwritable at agent level.'
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
  sayingClassifierPipeline: {
    id: 'app.components.RasaSettings.sayingClassifierPipeline',
    defaultMessage: 'Intent Classifier Pipeline:',
  },
  keywordClassifierPipeline: {
    id: 'app.components.RasaSettings.keywordClassifierPipeline',
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
