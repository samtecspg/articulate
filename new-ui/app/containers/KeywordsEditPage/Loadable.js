/**
 *
 * Asynchronously loads the component for KeywordsEditPage
 *
 */

import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./index'),
  loading: () => null,
});
