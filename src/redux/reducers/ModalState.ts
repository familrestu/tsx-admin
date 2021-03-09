import { OPENMODAL, CLOSEMODAL, ModalActions } from '../actions/ModalActions';

export type ModalStateType = {
    isOpened: boolean;
    path: string | null;
    accessmode: 0 | 1 | 2 | 3 | 'read' | 'write' | 'update' | 'delete' | null;
    modalParams?: { [key: string]: string } | null;
};

const DefaultState: ModalStateType = {
    isOpened: false,
    path: null,
    accessmode: null,
    modalParams: null,
};

const ModalState = (state: ModalStateType = DefaultState, action: ModalActions) => {
    switch (action.type) {
        case OPENMODAL:
            return { ...state, isOpened: true, path: action.path, accessmode: action.accessmode, modalParams: action.modalParams };
        case CLOSEMODAL:
            return DefaultState;
        default:
            return state;
    }
};

export default ModalState;
