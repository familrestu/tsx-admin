export const TOGGLE_DARK_THEME = 'TOGGLE_DARK_THEME';

export type ThemeAction = {
    type: typeof TOGGLE_DARK_THEME;
    status: boolean;
    style: Record<string, unknown>;
};
