import { UserStateType } from '../reducers/UserState';
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

type LoginActionType = {
    type: typeof LOGIN;
    data: UserStateType;
};

type LogoutActionType = {
    type: typeof LOGOUT;
};

export type UserActions = LoginActionType | LogoutActionType;
