/**
 *
 * Asynchronously loads the component for AddCategoryPage
 *
 */

import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./index'),
  loading: () => null,
});
