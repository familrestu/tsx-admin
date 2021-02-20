import { ModalStateType } from '../reducers/ModalState';

export const OPENMODAL = 'OPENMODAL';
export const CLOSEMODAL = 'CLOSEMODAL';
export const SETMODALACCESS = 'SETMODALACCESS';

type OpenModal = {
    type: typeof OPENMODAL;
    path: ModalStateType['path'];
    accessmode: ModalStateType['accessmode'];
    modalParams?: ModalStateType['modalParams'];
};

type CloseModal = {
    type: typeof CLOSEMODAL;
};

type SetModalAccess = {
    type: typeof SETMODALACCESS;
    accessmode: ModalStateType['accessmode'];
};

export type ModalActions = OpenModal | CloseModal | SetModalAccess;
