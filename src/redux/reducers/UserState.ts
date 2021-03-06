import { LOGIN, LOGOUT, UserActions } from '../actions/UserAction';

type UserStatePropsType = {
    isLoggedIn: boolean;
    user_id: number | null;
    username: string | null;
    email: string | null;
    app_id: number | null;
    app_code: string | null;
    app_name: string | null;
    app_logo: string | null;
    app_logo_small: string | null;
    activated_app: string | null;
    app_list: { [key: string]: string }[];
    default_app: string | null;
    current_app: string | null;
    full_name: string | null;
    profile_picture: string | null;
};

const DefaultState: UserStatePropsType = {
    isLoggedIn: false,
    user_id: null,
    username: null,
    email: null,
    app_id: null,
    app_code: null,
    app_name: null,
    app_logo: null,
    app_logo_small: null,
    activated_app: null,
    app_list: [],
    default_app: null,
    current_app: null,
    full_name: null,
    profile_picture: null,
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
