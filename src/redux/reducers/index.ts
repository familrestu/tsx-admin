/* eslint-disable @typescript-eslint/no-explicit-any */
import { combineReducers } from 'redux';

import UserState from 'redux/reducers/UserState';
import MenuAuthState from 'redux/reducers/MenuAuthState';
import PageState from 'redux/reducers/PageState';
import ModalState from 'redux/reducers/ModalState';

type ReducersType = {
    UserState?: typeof UserState;
    MenuAuthState?: typeof MenuAuthState;
    PageState?: typeof PageState;
    ModalState?: typeof ModalState;
};

const Reducers: ReducersType = {
    UserState,
    MenuAuthState,
    PageState,
    ModalState,
};

const rootReducer = combineReducers(Reducers);

export default rootReducer;
