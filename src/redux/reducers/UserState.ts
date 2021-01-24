import { LOGIN, LOGOUT, UserActions } from '../actions/UserAction';

type UserStatePropsType = {
    loggedIn: boolean;
};

const DefaultState: UserStatePropsType = {
    loggedIn: false,
};

const UserState = (state: UserStatePropsType = DefaultState, action: UserActions) => {
    switch (action.type) {
        case LOGIN:
            return { ...state, loggedIn: true, ...action.data };
        case LOGOUT:
        default:
            return state;
    }
};

export default UserState;
