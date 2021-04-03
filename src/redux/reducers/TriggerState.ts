import { LOGOUT, LOGOUTACTION } from 'redux/reducers/UserState';

/* action */
export type SETTRIGGERACTION = {
    type: typeof SETTRIGGER;
    eventName: string;
};

type CLEARTRIGGERACTION = {
    type: typeof CLEARTRIGGER;
};

export const SETTRIGGER = 'SETTRIGGER';
const CLEARTRIGGER = 'CLEARTRIGGER';

type TRIGGERACTIONTYPE = SETTRIGGERACTION | LOGOUTACTION | CLEARTRIGGERACTION;

/* reducer */
type TriggerStateType = {
    eventName: string | null;
};

const DefaultState: TriggerStateType = {
    eventName: null,
};

const TriggerState = (state: TriggerStateType = DefaultState, action: TRIGGERACTIONTYPE) => {
    switch (action.type) {
        case SETTRIGGER:
            return { eventName: action.eventName };
        case CLEARTRIGGER:
        case LOGOUT:
            return DefaultState;
        default:
            return state;
    }
};

export default TriggerState;
