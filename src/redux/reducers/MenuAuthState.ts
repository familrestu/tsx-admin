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

const DefaultState: MenuAuthStateType = [
    {
        group: null,
        groupid: null,
        id: 'dashboard',
        icon: 'fas fa-tachometer-alt',
        name: 'Dashboard',
        link: '/',
        componentPath: '/',
        isMenu: 'No',
        isGlobal: 'No',
        accessmode: 3,
        pageType: 'dashboard',
    },
];

const MenuAuthState = (state: MenuAuthStateType = DefaultState, action: MenuActions) => {
    switch (action.type) {
        case SETUSERMENU:
            return [...state, ...action.data];
        default:
            return state;
    }
};

export default MenuAuthState;
