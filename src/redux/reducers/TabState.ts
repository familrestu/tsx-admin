// import { OPENTAB, CHANGETABCONTENT, CLEARTAB, CLEARMODALTAB, TabActions } from '../actions/TabActions';
/* action */
const OPENTAB = 'OPENTAB';
const CHANGETABCONTENT = 'CHANGETABCONTENT';
const CLEARTAB = 'CLEARTAB';
const CLEARMODALTAB = 'CLEARMODALTAB';

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

type TABACTIONTYPE = OPENTABACTION | CHANGETABCONTENTACTION | CLEARTABACTION | CLEARMODALTABACTION;

/* reducer */
export type TabStateType = {
    path: string | null;
    accessmode: 0 | 1 | 2 | 3 | 'read' | 'write' | 'update' | 'delete' | null;
    tabcontentpath: string | null;
    tabcontentrefferer: string | null;
    tabcontentaccessmode: 0 | 1 | 2 | 3 | 'read' | 'write' | 'update' | 'delete' | null;
};

const DefaultState: TabStateType = {
    path: null,
    accessmode: null,
    tabcontentpath: null,
    tabcontentrefferer: null,
    tabcontentaccessmode: null,
};

const TabState = (state: TabStateType = DefaultState, action: TABACTIONTYPE) => {
    switch (action.type) {
        case OPENTAB:
            return { ...state, path: action.path, accessmode: action.accessmode, tabcontentpath: null, tabcontentrefferer: null, tabcontentaccessmode: null };
        case CHANGETABCONTENT:
            return { ...state, tabcontentpath: action.tabcontentpath, tabcontentrefferer: action.tabcontentrefferer, tabcontentaccessmode: action.tabcontentaccessmode };
        case CLEARMODALTAB:
            return { ...state, modaltabpath: null, modaltabaccessmode: null };
        case CLEARTAB:
            return DefaultState;
        default:
            return state;
    }
};

export default TabState;
