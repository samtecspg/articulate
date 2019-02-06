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
    id: 'app.components.DeleteFooter.deleteMessageDialog',
    defaultMessage: 'You are going to permanently delete this ',
  },
  deleteQuestion: {
    id: 'app.components.DeleteFooter.deleteQuestion',
    defaultMessage: 'Are you sure?',
  },
  no: {
    id: 'app.components.DeleteFooter.no',
    defaultMessage: 'No',
  },
  delete: {
    id: 'app.components.DeleteFooter.delete',
    defaultMessage: 'Delete'
  }
});
