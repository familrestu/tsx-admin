import { createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './reducers/index';

export type AppState = ReturnType<typeof rootReducer>;

// export const store = createStore(rootReducer);
export const store = createStore(rootReducer, composeWithDevTools());
