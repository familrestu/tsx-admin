import { OPENPAGE, PageActions } from '../actions/PageAction';

export type PageStateType = {
    path: string | null;
    accessmode?: 0 | 1 | 2 | 3 | 'read' | 'write' | 'update' | 'delete' | null;
};

const DefaultState: PageStateType = {
    path: null,
    accessmode: 0,
};

const PageState = (state: PageStateType = DefaultState, action: PageActions) => {
    switch (action.type) {
        case OPENPAGE:
            return { ...state, path: action.path, accessmode: action.accessmode };
        default:
            return state;
    }
};

export default PageState;
