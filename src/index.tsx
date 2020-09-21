import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';

import { Provider } from 'react-redux';
import { store } from 'redux/store';
import EntryPoint from 'screens/EntryPoint';

import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'simplebar/dist/simplebar.min.css';
import 'themes/main.scss';

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <EntryPoint />
        </Provider>
    </React.StrictMode>,
    document.getElementById('root-container'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
