import { PageStateType } from '../reducers/PageState';

export const OPENPAGE = 'OPENPAGE';
export const OPENTAB = 'OPENTAB';
export const LOGIN = 'LOGIN';

type OpenPageActionType = {
    type: typeof OPENPAGE;
    path: PageStateType['path'];
    accessmode: PageStateType['accessmode'];
};

export type PageActions = OpenPageActionType;
