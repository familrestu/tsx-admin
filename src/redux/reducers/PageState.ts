import { OPENPAGE, PageActions } from '../actions/PageAction';

export type PageStateType = {
    path: string | null;
    accessmode?: 0 | 1 | 2 | 3 | 'read' | 'write' | 'update' | 'delete';
};

const DefaultState: PageStateType = {
    path: null,
    accessmode: 0,
};

const PageState = (state: PageStateType = DefaultState, action: PageActions) => {
    switch (action.type) {
        case OPENPAGE:
            return { ...state, path: action.path, accessmode: action.accessmode };
        // case 'LOGIN':
        // return { ...state, path: '/', accessmode: 3 };
        default:
            return DefaultState;
    }
};

export default PageState;
