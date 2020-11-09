export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

type LoginActionType = {
    type: typeof LOGIN;
    loggedIn: boolean;
    jwt: string;
};

type LogoutActionType = {
    type: typeof LOGOUT;
    loggedIn: boolean;
};

export type UserActions = LoginActionType | LogoutActionType;
