import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';

import { Provider } from 'react-redux';
import { store } from 'redux/store';
import EntryPoint from 'screens/EntryPoint';

import '@fortawesome/fontawesome-free/css/all.min.css';
import 'simplebar/dist/simplebar.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'assets/styles/main.scss';

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <EntryPoint />
        </Provider>
    </React.StrictMode>,
    document.getElementById('root-container'),
);

/* ReactDOM.render(
    <Provider store={store}>
        <EntryPoint />
    </Provider>,
    document.getElementById('root-container'),
);
 */

serviceWorker.register();
