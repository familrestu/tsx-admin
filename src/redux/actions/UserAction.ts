export const LOGIN = 'LOGIN';

type DoLogin = {
    type: typeof LOGIN;
    loggedIn: boolean;
    jwt: string;
};

export type UserActions = DoLogin;
