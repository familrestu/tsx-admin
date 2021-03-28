import { UserAccessDetailType } from './AccessState';

/* action */
type SETMENUANDACCESSACTION = {
    type: typeof SETMENUANDACCESS;
    menu: UserMenuDetailType[];
    access: UserAccessDetailType[];
};

type LOGOUTACTION = {
    type: typeof LOGOUT;
};

const SETMENUANDACCESS = 'SETMENUANDACCESS';
const LOGOUT = 'LOGOUT';

type MENUACTIONTYPE = LOGOUTACTION | SETMENUANDACCESSACTION;

/* reducer */
export type UserMenuDetailType = {
    menu_id: string;
    menu_name: string;
    group_name: string | null;
    icon: string | null;
    url: string;
    pagepath: string | null;
    access_only: 0 | 1;
    accessmode: 0 | 1 | 2 | 3 | 'read' | 'write' | 'update' | 'delete';
    children?: UserMenuDetailType[];
};

const DefaultState: UserMenuDetailType[] = [];

const AccessState = (state: UserMenuDetailType[] = DefaultState, action: MENUACTIONTYPE): UserMenuDetailType[] => {
    switch (action.type) {
        case SETMENUANDACCESS:
            return [...action.menu];
        case LOGOUT:
            return DefaultState;
        default:
            return state;
    }
};

export default AccessState;
