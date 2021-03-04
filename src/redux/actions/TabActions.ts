import { TabStateType } from '../reducers/TabState';

export const OPENTAB = 'OPENTAB';
export const OPENMODALTAB = 'OPENMODALTAB';
export const CLEARTAB = 'CLEARTAB';
export const CLEARMODALTAB = 'CLEARMODALTAB';

type OpenTabsActionsType = {
    type: typeof OPENTAB;
    path: TabStateType['path'];
    accessmode: TabStateType['accessmode'];
};

type OpenModalTabsActionsType = {
    type: typeof OPENMODALTAB;
    modaltabpath: TabStateType['modaltabpath'];
    modaltabaccessmode: TabStateType['modaltabaccessmode'];
};

type ClearTab = {
    type: typeof CLEARTAB;
};

type ClearModalTab = {
    type: typeof CLEARMODALTAB;
};

export type TabActions = OpenTabsActionsType | OpenModalTabsActionsType | ClearTab | ClearModalTab;
