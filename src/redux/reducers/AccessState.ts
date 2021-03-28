import { UserMenuDetailType } from './MenuState';

/* actions */
type SETMENUANDACCESSACTION = {
    type: typeof SETMENUANDACCESS;
    menu: UserMenuDetailType[];
    access: UserAccessDetailType[];
};

type LOGOUTACTION = {
    type: typeof LOGOUT;
};

const LOGOUT = 'LOGOUT';
const SETMENUANDACCESS = 'SETMENUANDACCESS';

type ACCESSACTIONTYPE = LOGOUTACTION | SETMENUANDACCESSACTION;

/* reducers */
export type UserAccessDetailType = {
    name: string;
    url: string;
    pagepath: string | null;
    accessmode: 0 | 1 | 2 | 3 | 'read' | 'write' | 'update' | 'delete';
};

const DefaultState: UserAccessDetailType[] = [];

const AccessState = (state: UserAccessDetailType[] = DefaultState, action: ACCESSACTIONTYPE): UserAccessDetailType[] => {
    switch (action.type) {
        case SETMENUANDACCESS:
            return [...action.access];
        case LOGOUT:
            return DefaultState;
        default:
            return state;
    }
};

export default AccessState;
