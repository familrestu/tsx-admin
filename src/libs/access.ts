import { AppState } from 'redux/store';

const GetAccessMode = (PageState: AppState['PageState'], ModalState: AppState['ModalState'], TabState: AppState['TabState']) => {
    let accessmode = null;

    if (TabState.accessmode !== null) {
        accessmode = TabState.accessmode;
    } else if (ModalState.accessmode !== null && ModalState.isOpened) {
        accessmode = ModalState.accessmode;
    } else {
        accessmode = PageState.accessmode;
    }

    return accessmode;
};

const GetCurrentPath = (PageState: AppState['PageState'], ModalState: AppState['ModalState'], TabState: AppState['TabState']) => {
    let path = null;

    if (TabState.path !== null) {
        path = TabState.path;
    } else if (ModalState.path !== null && ModalState.isOpened) {
        path = ModalState.path;
    } else {
        path = PageState.path;
    }

    return path;
};

export { GetAccessMode, GetCurrentPath };
