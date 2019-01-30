/*
 * ExitModal Messages
 *
 * This contains all the text for the ExitModal component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  exitMessageDialog1: {
    id: 'app.components.ExitModal.exitMessageDialog',
    defaultMessage: 'You currently have unsaved changes in this',
  },
  exitMessageDialog2: {
    id: 'app.components.ExitModal.exitMessageDialog',
    defaultMessage: 'and you are about to exit without saving…',
  },
  exitQuestion: {
    id: 'app.components.ExitModal.deleteQuestion',
    defaultMessage: 'Do you want to save and exit?',
  },
  saveAndExit: {
    id: 'app.components.ExitModal.save',
    defaultMessage: 'Save and Exit',
  },
  exit: {
    id: 'app.components.ExitModal.exit',
    defaultMessage: 'Exit'
  }
});
