import { createStore } from 'redux';

import rootReducer from './reducers/index';
// import rootAction from '@redux/actions';

export type AppState = ReturnType<typeof rootReducer>;
// export type AppActions = rootAction;

export const store = createStore(rootReducer);
