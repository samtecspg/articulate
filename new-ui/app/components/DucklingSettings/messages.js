/*
 * DucklingSettings Messages
 *
 * This contains all the text for the DucklingSettings component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  ducklingSettingDescription: {
    id: 'app.components.DucklingSettings.ducklingSettingDescription',
    defaultMessage: 'If you modify these values the global settings for Duckling will be overriden.'
  },
  ducklingURL: {
    id: 'app.components.DucklingSettings.ducklingURL',
    defaultMessage: 'Duckling URL',
  },
  ducklingURLPlaceholder: {
    id: 'app.components.DucklingSettings.ducklingURLPlaceholder',
    defaultMessage: 'Enter the URL of your duckling server',
  },
  ducklingDimension: {
    id: 'app.components.DucklingSettings.ducklingDimension',
    defaultMessage: 'Duckling Dimensions:',
  },
  requiredField: {
    id: 'app.components.DucklingSettings.requiredField',
    defaultMessage: '*Required'
  },
});
