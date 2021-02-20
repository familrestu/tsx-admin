import { PageStateType } from '../reducers/PageState';

export const OPENTAB = 'OPENTAB';
export const CLEARTAB = 'CLEARTAB';

type OpenTabsActionsType = {
    type: typeof OPENTAB;
    path: PageStateType['path'];
    accessmode: PageStateType['accessmode'];
};

type ClearTab = {
    type: typeof CLEARTAB;
};

export type TabActions = OpenTabsActionsType | ClearTab;
