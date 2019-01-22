/*
 * DeleteFooter Messages
 *
 * This contains all the text for the DeleteFooter component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  deleteMessage: {
    id: 'app.components.DeleteFooter.deleteMessage',
    defaultMessage: 'Warning! this will delete the whole ',
  },
  deleteMessageDialog: {
    id: 'app.containers.AgentsPage.components.AgentsCards.deleteMessage',
    defaultMessage: 'You are going to permanently delete this ',
  },
  deleteQuestion: {
    id: 'app.containers.AgentsPage.components.AgentsCards.deleteMessage',
    defaultMessage: 'Are you sure?',
  },
  no: {
    id: 'app.containers.AgentsPage.components.AgentsCards.no',
    defaultMessage: 'No',
  },
  delete: {
    id: 'app.components.DeleteFooter.delete',
    defaultMessage: 'Delete'
  },
  no: {
    id: 'app.components.DeleteFooter.delete',
    defaultMessage: 'No'
  }
});
