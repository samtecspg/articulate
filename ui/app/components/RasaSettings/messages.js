/*
 * RasaSettings Messages
 *
 * This contains all the text for the RasaSettings component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  rasaSettingDescription: {
    id: 'app.components.RasaSettings.rasaSettingDescription',
    defaultMessage:
      'You can configure the address of your rasa instance and the desired pipelines you would like for your models. This values are overwritable at agent level.',
  },
  rasaURL: {
    id: 'app.components.RasaSettings.rasaURL',
    defaultMessage: 'Rasa URL',
  },
  rasaURLPlaceholder: {
    id: 'app.components.RasaSettings.rasaURLPlaceholder',
    defaultMessage: 'Enter the URL of your rasa server',
  },
  rasaConcurrentRequests: {
    id: 'app.components.RasaSettings.rasaConcurrentRequests',
    defaultMessage: 'Rasa Max Concurrent Requests',
  },
  rasaConcurrentRequestsPlaceholder: {
    id: 'app.components.RasaSettings.rasaConcurrentRequestsPlaceholder',
    defaultMessage: 'Enter the maximum concurrent requests for RASA',
  },
  categoryClassifierPipeline: {
    id: 'app.components.RasaSettings.categoryClassifierPipeline',
    defaultMessage: 'Category Classifier Pipeline:',
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
    defaultMessage: '*Required',
  },
  pipelineError: {
    id: 'app.components.RasaSettings.pipelineError',
    defaultMessage:
      'This value is not valid for a rasa pipeline. Please specify an array of objects, you can select a default pipeline in the top right.',
  },
  spacyPretrainedEntitiesError: {
    id: 'app.components.RasaSettings.spacyPretrainedEntitiesError',
    defaultMessage:
      "Please verify this value. It should be an array of strings. Example: ['one', 'two', 'three'].",
  },
  keywords: {
    id: 'app.components.RasaSettings.keywords',
    defaultMessage: 'Keywords',
  },
  tensorflow: {
    id: 'app.components.RasaSettings.tensorflow',
    defaultMessage: 'Tensorflow',
  },
  spacy: {
    id: 'app.components.RasaSettings.spacy',
    defaultMessage: 'Spacy',
  }
});
