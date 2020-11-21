import { SETUSERMENU, MenuActions } from '../actions/MenuAuthActions';

export type MenuAuthStateType = {
    group: string | null;
    groupid: string | null;
    id: string;
    icon: string | null;
    name: string;
    link: string;
    componentPath?: string;
    isMenu: 0 | 1 | 'No' | 'Yes';
    isGlobal: 0 | 1 | 'No' | 'Yes';
    accessmode?: 0 | 1 | 2 | 3 | 'read' | 'write' | 'update' | 'delete';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    children?: any;
}[];

const DefaultState: MenuAuthStateType = [
    {
        group: null,
        groupid: null,
        id: 'dashboard',
        icon: 'fas fa-tachometer-alt',
        name: 'Dashboard',
        link: '/',
        isMenu: 0,
        isGlobal: 0,
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
