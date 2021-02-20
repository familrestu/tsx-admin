import { OPENTAB, CLEARTAB, TabActions } from '../actions/TabActions';

export type TabStateType = {
    path: string | null;
    accessmode?: 0 | 1 | 2 | 3 | 'read' | 'write' | 'update' | 'delete';
};

const DefaultState: TabStateType = {
    path: null,
    accessmode: 0,
};

const TabState = (state: TabStateType = DefaultState, action: TabActions) => {
    switch (action.type) {
        case OPENTAB:
            return { ...state, path: action.path, accessmode: action.accessmode };
        case CLEARTAB:
            return DefaultState;
        default:
            return state;
    }
};

export default TabState;
