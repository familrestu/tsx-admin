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

export type ModalActions = OpenModal | CloseModal;
