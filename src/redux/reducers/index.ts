/* eslint-disable @typescript-eslint/no-explicit-any */
import { combineReducers } from 'redux';

import UserState from 'redux/reducers/UserState';
import MenuAuthState from 'redux/reducers/MenuAuthState';
import ModalState from 'redux/reducers/ModalState';

type ReducersType = {
    UserState?: typeof UserState;
    MenuAuthState?: typeof MenuAuthState;
    ModalState?: typeof ModalState;
};

const Reducers: ReducersType = {
    UserState,
    MenuAuthState,
    ModalState,
};

const rootReducer = combineReducers(Reducers);

export default rootReducer;
