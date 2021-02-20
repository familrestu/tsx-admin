import { createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { combineReducers } from 'redux';
import Reducers from './reducers/index';

const RootReducer = combineReducers(Reducers);
export type AppState = ReturnType<typeof RootReducer>;
export const store = createStore(RootReducer, composeWithDevTools());
