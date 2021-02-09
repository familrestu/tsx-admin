import { ModalStateType } from '../reducers/ModalState';

export const OPENMODAL = 'OPENMODAL';
export const CLOSEMODAL = 'CLOSEMODAL';

type OpenModal = {
    type: typeof OPENMODAL;
    path: ModalStateType['path'];
    modalParams?: ModalStateType['modalParams'];
};

type CloseModal = {
    type: typeof CLOSEMODAL;
};

export type ModalActions = OpenModal | CloseModal;
