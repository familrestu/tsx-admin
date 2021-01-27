import { ModalStateType } from '../reducers/ModalState';

export const OPENMODAL = 'OPENMODAL';
export const CLOSEMODAL = 'CLOSEMODAL';

type OpenModal = {
    type: typeof OPENMODAL;
    path: ModalStateType['path'];
    isGlobal: ModalStateType['isGlobal'];
    // children: ModalStateType['children'];
};

type CloseModal = {
    type: typeof CLOSEMODAL;
    // path: ModalStateType['path'];
    // isGlobal: ModalStateType['isGlobal'];
    // children: ModalStateType['children'];
};

export type ModalActions = OpenModal | CloseModal;
