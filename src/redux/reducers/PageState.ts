/* action */
const OPENPAGE = 'OPENPAGE';

type OPENPAGEACTION = {
    type: typeof OPENPAGE;
    path: PageStateType['path'];
    accessmode: PageStateType['accessmode'];
};

type PAGEACTIONTYPE = OPENPAGEACTION;

/* reducer */
export type PageStateType = {
    path: string | null;
    accessmode: 0 | 1 | 2 | 3 | 'read' | 'write' | 'update' | 'delete' | null;
};

const DefaultState: PageStateType = {
    path: null,
    accessmode: 0,
};

const PageState = (state: PageStateType = DefaultState, action: PAGEACTIONTYPE) => {
    switch (action.type) {
        case OPENPAGE:
            return { ...state, path: action.path, accessmode: action.accessmode };
        default:
            return state;
    }
};

export default PageState;
