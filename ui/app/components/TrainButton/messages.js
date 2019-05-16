/*
 * TrainButton Messages
 *
 * This contains all the text for the TrainButton component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  trainButton: {
    id: 'app.components.TrainButton.trainButton',
    defaultMessage: 'Train',
  },
  statusOutOfDate: {
    id: 'app.components.TrainButton.statusOutOfDate',
    defaultMessage: 'Needs Training',
  },
  statusError: {
    id: 'app.components.TrainButton.statusError',
    defaultMessage: 'Training Error',
  },
  statusTraining: {
    id: 'app.components.TrainButton.statusTraining',
    defaultMessage: 'Training',
  },
  statusReady: {
    id: 'app.components.TrainButton.statusReady',
    defaultMessage: 'Trained ',
  },
  neverTrained: {
    id: 'app.components.TrainButton.neverTrained',
    defaultMessage: 'never',
  },
  justNow: {
    id: 'app.components.TrainButton.justNow',
    defaultMessage: 'just now',
  },
  anotherAgentTraining: {
    id: 'app.components.TrainButton.anotherAgentTraining',
    defaultMessage: 'Another agent is currently training',
  }
});
