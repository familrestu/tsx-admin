import { OPENMODAL, ModalActions, CLOSEMODAL } from '../actions/ModalActions';

export type ModalStateType = {
    isOpened: boolean;
    path: string | null;
    modalParams?: { [key: string]: string } | null;
};

const DefaultState: ModalStateType = {
    isOpened: false,
    path: null,
    modalParams: null,
};

const MenuAuthState = (state: ModalStateType = DefaultState, action: ModalActions) => {
    switch (action.type) {
        case OPENMODAL:
            return { ...state, isOpened: true, path: action.path, modalParams: action.modalParams };
        case CLOSEMODAL:
        default:
            return DefaultState;
    }
};

export default MenuAuthState;
