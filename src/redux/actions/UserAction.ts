export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

type LoginActionType = {
    type: typeof LOGIN;
    data: { [key: string]: string | boolean };
};

type LogoutActionType = {
    type: typeof LOGOUT;
};

export type UserActions = LoginActionType | LogoutActionType;
