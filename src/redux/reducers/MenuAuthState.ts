import { SETUSERMENU, MenuActions } from '../actions/MenuAuthActions';

type MenuAuthStateType = {
    group: string | null;
    groupid: string | null;
    id: string;
    icon: string | null;
    name: string;
    link: string;
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
    },
    {
        group: 'Components',
        groupid: 'components',
        id: 'form',
        icon: 'fas fa-clipboard',
        name: 'form',
        link: '/form',
    },
    {
        group: 'Components',
        groupid: 'components',
        id: 'page',
        icon: 'fas fa-columns',
        name: 'page',
        link: '/page',
    },
    {
        group: 'Components',
        groupid: 'components',
        id: 'table',
        icon: 'fas fa-table',
        name: 'table',
        link: '/table',
    },
    {
        group: 'Bootstrap',
        groupid: 'bootstrap',
        id: 'input',
        icon: 'fas fa-keyboard',
        name: 'input',
        link: '/bootstrap/input',
        children: [
            {
                group: null,
                groupid: null,
                id: 'text',
                icon: null,
                name: 'Text',
                link: '/bootstrap/input/text',
            },
            {
                group: 'Selection',
                groupid: 'Selection',
                id: 'radio',
                icon: null,
                name: 'radio',
                link: '/bootstrap/input/radio',
                children: [
                    {
                        group: 'nestedgroup',
                        groupid: 'nestedgroup',
                        id: 'textNested',
                        icon: null,
                        name: 'TextNested',
                        link: '/bootstrap/input/textNested',
                    },
                    {
                        group: 'nestedgroup',
                        groupid: 'nestedgroup',
                        id: 'radioNested',
                        icon: null,
                        name: 'radioNested',
                        link: '/bootstrap/input/radioNested',
                    },
                    {
                        group: 'nestedgroup',
                        groupid: 'nestedgroup',
                        id: 'checkboxNested',
                        icon: null,
                        name: 'checkboxNested',
                        link: '/bootstrap/input/checkboxNested',
                    },
                ],
            },
            {
                group: 'Selection',
                groupid: 'Selection',
                id: 'checkbox',
                icon: null,
                name: 'checkbox',
                link: '/bootstrap/input/checkbox',
            },
        ],
    },
];

const MenuAuthState = (
    state: MenuAuthStateType = DefaultState,
    action: MenuActions,
) => {
    switch (action.type) {
        case SETUSERMENU:
            return { ...state };
        default:
            return state;
    }
};

export default MenuAuthState;
