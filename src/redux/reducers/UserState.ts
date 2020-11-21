import { LOGIN, LOGOUT, UserActions } from '../actions/UserAction';

/* export type UserStateType = {
    loggedIn: boolean;
    app: string | null;
    jwt: string | null;
}; */

/* export type UserStateType = {
    loggedIn?: boolean;
    app?: string;
    username?: string;
    email?: string;
    full_name?: string;
    first_name?: string;
    middle_name?: string;
    last_name?: string;
    gender?: number;
    identification_no?: string;
    taxfile_no?: string;
    birth_date?: string;
    birth_place?: string;
    phone?: string;
    mobile_phone?: string;
    address?: string;
    company_name?: string;
    department_name?: string;
    position_name?: string;
    profile_picture?: string | null;
}; */

const DefaultState: any = {
    loggedIn: false,
};

const UserState = (state: any = DefaultState, action: UserActions) => {
    switch (action.type) {
        case LOGIN:
            return { ...state, loggedIn: true, ...action.data };
        case LOGOUT:
        default:
            return state;
    }
};

export default UserState;
