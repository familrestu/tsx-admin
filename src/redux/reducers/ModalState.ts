import { OPENMODAL, ModalActions, CLOSEMODAL } from '../actions/ModalActions';

export type ModalStateType = {
    isOpened: boolean;
    path: string | null;
    isGlobal: number | string | 'No' | 'Yes' | 1 | 2 | null;
    // children: JSX.Element | JSX.Element[] | Element | Element[] | null;
};

const DefaultState: ModalStateType = {
    isOpened: false,
    path: null,
    isGlobal: null,
    // children: null,
};

const MenuAuthState = (state: ModalStateType = DefaultState, action: ModalActions) => {
    switch (action.type) {
        case OPENMODAL:
            return { ...state, isOpened: true, path: action.path, isGlobal: action.isGlobal /* , children: action.children */ };
        case CLOSEMODAL:
        default:
            return DefaultState;
    }
};

export default MenuAuthState;
