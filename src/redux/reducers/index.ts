import UserState from 'redux/reducers/UserState';
import MenuAuthState from 'redux/reducers/MenuAuthState';
import PageState from 'redux/reducers/PageState';
import ModalState from 'redux/reducers/ModalState';
import TabState from 'redux/reducers/TabState';

/* type ReducersType = {
    UserState?: typeof UserState;
    MenuAuthState?: typeof MenuAuthState;
    PageState?: typeof PageState;
    ModalState?: typeof ModalState;
    TabState?: typeof TabState;
};
 */

/* const Reducers: ReducersType = {
    UserState,
    MenuAuthState,
    PageState,
    ModalState,
    TabState,
}; */

const Reducers = {
    UserState,
    MenuAuthState,
    PageState,
    ModalState,
    TabState,
};

// const rootReducer = combineReducers(Reducers);
export default Reducers;
