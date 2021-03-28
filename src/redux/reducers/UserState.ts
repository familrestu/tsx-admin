/* action */
const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

type LOGINACTION = {
    type: typeof LOGIN;
    data: { [key: string]: string | boolean };
};

export type LOGOUTACTION = {
    type: typeof LOGOUT;
};

type UserActions = LOGINACTION | LOGOUTACTION;

/* reducer */
type UserStatePropsType = {
    isLoggedIn: boolean;
    user_id: number | null;
    user_name: string | null;
    email: string | null;
    company_id: number | null;
    company_code: string | null;
    company_name: string | null;
    company_logo: string | null;
    company_logo_small: string | null;
    current_company: string | null;
    current_app: string | null;
    displayname: string | null;
    profile_picture: string | null;
    user_type: number | null;
};

const DefaultState: UserStatePropsType = {
    isLoggedIn: false,
    user_id: null,
    user_name: null,
    email: null,
    company_id: null,
    company_code: null,
    company_name: null,
    company_logo: null,
    company_logo_small: null,
    current_company: null,
    current_app: null,
    displayname: null,
    profile_picture: null,
    user_type: null,
};

const UserState = (state: UserStatePropsType = DefaultState, action: UserActions) => {
    switch (action.type) {
        case LOGIN:
            return { ...state, isLoggedIn: true, ...action.data };
        case LOGOUT:
            return DefaultState;
        default:
            return state;
    }
};

export default UserState;
