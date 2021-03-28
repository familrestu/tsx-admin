import { createStore } from 'redux';
// import { composeWithDevTools } from 'redux-devtools-extension';
import { combineReducers } from 'redux';
import Reducers from './reducers/index';

const RootReducer = combineReducers(Reducers);
export type AppState = ReturnType<typeof RootReducer>;
export const store = createStore(
    RootReducer,
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__({ trace: process.env.NODE_ENV === 'development' ? true : false, limit: 25 }),
);
