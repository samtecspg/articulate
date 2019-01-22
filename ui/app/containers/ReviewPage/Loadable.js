/**
 *
 * Asynchronously loads the component for ReviewPage
 *
 */

import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./index'),
  loading: () => null,
});
