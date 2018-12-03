/*
 * TrainButton Messages
 *
 * This contains all the text for the TrainButton component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  trainButton: {
    id: 'app.components.TrainButton.trainButton',
    defaultMessage: 'Train'
  },
  statusOutOfDate: {
    id: 'app.components.TrainButton.statusOutOfDate',
    defaultMessage: 'Status: out of date'
  },
  statusError: {
    id: 'app.components.TrainButton.statusError',
    defaultMessage: 'Status: error on training'
  },
  statusTraining: {
    id: 'app.components.TrainButton.statusTraining',
    defaultMessage: 'Status: updating agent…'
  },
  statusReady: {
    id: 'app.components.TrainButton.statusReady',
    defaultMessage: 'Last Trained: '
  }
});
