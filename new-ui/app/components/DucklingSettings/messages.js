/*
 * DucklingSettings Messages
 *
 * This contains all the text for the DucklingSettings component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  ducklingSettingDescription: {
    id: 'app.components.DucklingSettings.ducklingSettingDescription',
    defaultMessage: 'You can specify the address to your duckling server and also the dimensiones you want to use from the duckling service.'
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
