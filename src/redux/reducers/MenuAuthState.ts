import { SETUSERMENU, MenuActions } from '../actions/MenuAuthActions';

export type MenuAuthStateDetailType = {
    group: string | null;
    groupid: string | null;
    id: string;
    icon: string | null;
    name: string;
    link: string;
    componentPath: string | null;
    isMenu: 0 | 1 | 'No' | 'Yes';
    isGlobal: 0 | 1 | 'No' | 'Yes';
    accessmode: 0 | 1 | 2 | 3 | 'read' | 'write' | 'update' | 'delete';
    pageType: string | 'dashboard' | 'form' | 'form-tabs' | 'table';
    children?: MenuAuthStateType;
};

export type MenuAuthStateType = MenuAuthStateDetailType[];

const DefaultState: MenuAuthStateType = [];

const MenuAuthState = (state: MenuAuthStateType = DefaultState, action: MenuActions) => {
    switch (action.type) {
        case SETUSERMENU:
            return action.data;
        default:
            return state;
    }
};

export default MenuAuthState;
