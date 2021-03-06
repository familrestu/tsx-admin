import { LOGIN, LOGOUT, UserActions } from '../actions/UserAction';

type UserStatePropsType = {
    loggedIn: boolean;
    full_name: string | null;
    profile_picture: string | null;
    current_app: string | null;
};

const DefaultState: UserStatePropsType = {
    loggedIn: false,
    full_name: null,
    profile_picture: null,
    current_app: null,
};

const UserState = (state: UserStatePropsType = DefaultState, action: UserActions) => {
    switch (action.type) {
        case LOGIN:
            return { ...state, loggedIn: true, ...action.data };
        case LOGOUT:
            return DefaultState;
        default:
            return state;
    }
};

export default UserState;
