import { getAsyncInjectors } from './utils/asyncInjectors';

const errorLoading = (err) => {
  console.error('Dynamic page loading failed', err); // eslint-disable-line no-console
};

const loadModule = (cb) => (componentModule) => {
  cb(null, componentModule.default);
};

export default function createRoutes(store) {
  const { injectReducer, injectSagas } = getAsyncInjectors(store);

  return [
    {
      path: '/',
      name: 'home',
      getComponent(nextState, cb) {
        import('containers/HomePage')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    },
    {
      path: '/wizard/domain',
      name: 'wizardDomain',
      getComponent(nextState, cb) {
        import('containers/WizardDomainPage')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    },
    {
      path: '/wizard/entity-intent',
      name: 'wizardEntityIntent',
      getComponent(nextState, cb) {
        import('containers/WizardEntityIntentPage')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    },
    {
      path: '/agents/create',
      name: 'agents',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/AgentPage/reducer'),
          import('containers/AgentPage/sagas'),
          import('containers/AgentPage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('agent', reducer.default);
          injectSagas(sagas.default);

          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    },
    {
      path: '/agent/:id',
      name: 'agent',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/AgentDetailPage/reducer'),
          import('containers/AgentDetailPage/sagas'),
          import('containers/AgentDetailPage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('agent', reducer.default);
          injectSagas(sagas.default);

          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    },
    {
      path: '/domains/create',
      name: 'domains',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/DomainPage/reducer'),
          import('containers/DomainPage/sagas'),
          import('containers/DomainPage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('domain', reducer.default);
          injectSagas(sagas.default);

          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    },
    {
      path: '/domains',
      name: 'domains',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/DomainListPage/reducer'),
          import('containers/DomainListPage/sagas'),
          import('containers/DomainListPage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('domains', reducer.default);
          injectSagas(sagas.default);

          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    },
    {
      path: '/intents',
      name: 'intents',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/IntentListPage/reducer'),
          import('containers/IntentListPage/sagas'),
          import('containers/IntentListPage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('intents', reducer.default);
          injectSagas(sagas.default);

          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    },
    {
      path: '/intents/create',
      name: 'intents',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/IntentPage/reducer'),
          import('containers/IntentPage/sagas'),
          import('containers/IntentPage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('intent', reducer.default);
          injectSagas(sagas.default);

          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    },
    {
      path: '/entities',
      name: 'entities',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/EntityListPage/reducer'),
          import('containers/EntityListPage/sagas'),
          import('containers/EntityListPage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('entities', reducer.default);
          injectSagas(sagas.default);

          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    },
    {
      path: '/entities/create',
      name: 'entities',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/EntityPage/reducer'),
          import('containers/EntityPage/sagas'),
          import('containers/EntityPage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('entity', reducer.default);
          injectSagas(sagas.default);

          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    },
    {
      path: '/webhooks/create',
      name: 'webhooks',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/WebhookPage/reducer'),
          import('containers/WebhookPage/sagas'),
          import('containers/WebhookPage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('webhook', reducer.default);
          injectSagas(sagas.default);

          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    },
    {
      path: '*',
      name: 'notfound',
      getComponent(nextState, cb) {
        import('containers/NotFoundPage')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    },
  ];
}
