import { TOGGLE_DARK_THEME, ThemeAction } from 'redux/actions/ThemeAction';

const DefaultState = {};

const ThemeState = (state = DefaultState, action: ThemeAction) => {
    switch (action.type) {
        case TOGGLE_DARK_THEME: {
            return { ...state };
        }
        default:
            return state;
    }
};

export default ThemeState;
