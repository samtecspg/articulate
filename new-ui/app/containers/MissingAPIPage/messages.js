import { defineMessages } from 'react-intl';

export default defineMessages({
  missingAPITitle: {
    id: 'app.components.MissingAPIPage.title',
    defaultMessage: 'Error: agent head missing',
  },
  missingAPIDescription: {
    id: 'app.components.MissingAPIPage.description',
    defaultMessage: ' ',
  },
  homeBreadcrumb: {
    id: 'app.components.MissingAPIPage.home',
    defaultMessage: 'Home',
  },
  missingAPIParagraph: {
    id: 'app.components.MissingAPIPage.missing_api_paragraph',
    defaultMessage: 'We couldn\'t connect to the API. This could be because the API ports aren\'t configured properly in your environment. For configuration instruction go to here:',
  }
});
