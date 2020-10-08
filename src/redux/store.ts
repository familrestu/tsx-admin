import { createStore } from 'redux';
import rootReducer from './reducers/index';

export type AppState = ReturnType<typeof rootReducer>;

export const store = createStore(rootReducer);
