import { MenuAuthStateType } from '../reducers/MenuAuthState';

export const SETUSERMENU = 'SETUSERMENU';

type SetMenu = {
    type: typeof SETUSERMENU;
    data: MenuAuthStateType;
};

export type MenuActions = SetMenu;
