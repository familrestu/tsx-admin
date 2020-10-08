/* eslint-disable @typescript-eslint/no-explicit-any */
import { combineReducers } from 'redux';

import UserState from 'redux/reducers/UserState';
import MenuAuthState from 'redux/reducers/MenuAuthState';

type ReducersType = {
    UserState?: typeof UserState;
    MenuAuthState?: typeof MenuAuthState;
};

const Reducers: ReducersType = {
    UserState,
    MenuAuthState,
};

const rootReducer = combineReducers(Reducers);

export default rootReducer;
