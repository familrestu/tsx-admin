import { OPENTAB, OPENMODALTAB, CLEARTAB, CLEARMODALTAB, TabActions } from '../actions/TabActions';

export type TabStateType = {
    path: string | null;
    accessmode: 0 | 1 | 2 | 3 | 'read' | 'write' | 'update' | 'delete' | null;
    modaltabpath: string | null;
    modaltabaccessmode: 0 | 1 | 2 | 3 | 'read' | 'write' | 'update' | 'delete' | null;
};

const DefaultState: TabStateType = {
    path: null,
    accessmode: null,
    modaltabpath: null,
    modaltabaccessmode: null,
};

const TabState = (state: TabStateType = DefaultState, action: TabActions) => {
    switch (action.type) {
        case OPENTAB:
            return { ...state, path: action.path, accessmode: action.accessmode };
        case OPENMODALTAB:
            return { ...state, path: action.modaltabpath, accessmode: action.modaltabaccessmode };
        case CLEARMODALTAB:
            return { ...state, modaltabpath: null, modaltabaccessmode: null };
        case CLEARTAB:
            return DefaultState;
        default:
            return state;
    }
};

export default TabState;
