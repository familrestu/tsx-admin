import { TabStateType } from '../reducers/TabState';

export const OPENTAB = 'OPENTAB';
export const CHANGETABCONTENT = 'CHANGETABCONTENT';
export const CLEARTAB = 'CLEARTAB';
export const CLEARMODALTAB = 'CLEARMODALTAB';

type OPENTABACTION = {
    type: typeof OPENTAB;
    path: TabStateType['path'];
    accessmode: TabStateType['accessmode'];
    tabcontentpath: TabStateType['tabcontentpath'];
    tabcontentrefferer: TabStateType['tabcontentrefferer'];
    tabcontentaccessmode: TabStateType['tabcontentaccessmode'];
};

type CHANGETABCONTENTACTION = {
    type: typeof CHANGETABCONTENT;
    tabcontentpath: TabStateType['tabcontentpath'];
    tabcontentrefferer: TabStateType['tabcontentrefferer'];
    tabcontentaccessmode: TabStateType['tabcontentaccessmode'];
};

type CLEARTABACTION = {
    type: typeof CLEARTAB;
};

type CLEARMODALTABACTION = {
    type: typeof CLEARMODALTAB;
};

export type TabActions = OPENTABACTION | CHANGETABCONTENTACTION | CLEARTABACTION | CLEARMODALTABACTION;
