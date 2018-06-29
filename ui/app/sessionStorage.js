import transit from 'transit-immutable-js';

export const loadState = () => {
  try {
    const serializedState = sessionStorage.getItem('state');
    if (serializedState === null) {
      return undefined;
    }
    return transit.fromJSON(serializedState);
  } catch (err) {
    return undefined;
  }
};

export const saveState = (state) => {
  try {
    const globalState = state.global;
    const serializedState = transit.toJSON({ global: globalState });
    sessionStorage.setItem('state', serializedState);
  } catch (err) {
    console.log(err);
  }
};
