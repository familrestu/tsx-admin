import CSS from 'csstype';

/* index 0 - 10 = index * 10 = opacity percentage */
const OpacityHex = [
    '00',
    '1A',
    '33',
    '4D',
    '66',
    '80',
    '99',
    'B3',
    'CC',
    'E6',
    'FF',
];

const Primary = '#2a516e';

const White = '#ffffff';
const Black = '#575757';
const Grey = '#8c8c8c';
const Green = '#0ccf5a';
const Red = '#db3b3b';
const Orange = '#db883b';
const Yellow = '#ede61f';
const Blue = '#1f94ed';

type FontWeightType = {
    Light: 300;
    Medium: 600;
    Regular: 'normal';
    Bold: 'bold';
};

const FontFamily = 'Roboto';
const FontWeigt: FontWeightType = {
    Light: 300,
    Medium: 600,
    Regular: 'normal',
    Bold: 'bold',
};

const TypoGraphy: { [key: string]: CSS.Properties } = {
    Heading1: {
        fontFamily: FontFamily,
        fontSize: '96px',
        textTransform: 'none',
        letterSpacing: '-1.5px',
        fontWeight: FontWeigt.Light,
    },
    Heading2: {
        fontFamily: FontFamily,
        fontSize: '60px',
        textTransform: 'none',
        letterSpacing: '-0.5px',
        fontWeight: FontWeigt.Light,
    },
    Heading3: {
        fontFamily: FontFamily,
        fontSize: '48px',
        textTransform: 'none',
        letterSpacing: '0px',
        fontWeight: FontWeigt.Regular,
    },
    Heading4: {
        fontFamily: FontFamily,
        fontSize: '34px',
        textTransform: 'none',
        letterSpacing: '-0.25px',
        fontWeight: FontWeigt.Regular,
    },
    Heading5: {
        fontFamily: FontFamily,
        fontSize: '24px',
        textTransform: 'none',
        letterSpacing: '0px',
        fontWeight: FontWeigt.Regular,
    },
    Heading6: {
        fontFamily: FontFamily,
        fontSize: '20px',
        textTransform: 'none',
        letterSpacing: '0.15px',
        fontWeight: FontWeigt.Medium,
    },
    Subtitle1: {
        fontFamily: FontFamily,
        fontSize: '16px',
        textTransform: 'none',
        letterSpacing: '0.15px',
        fontWeight: FontWeigt.Regular,
    },
    Subtitle2: {
        fontFamily: FontFamily,
        fontSize: '14px',
        textTransform: 'none',
        letterSpacing: '0.1px',
        fontWeight: FontWeigt.Medium,
    },
    Body1: {
        fontFamily: FontFamily,
        fontSize: '16px',
        textTransform: 'none',
        letterSpacing: '0.5px',
        fontWeight: FontWeigt.Regular,
    },
    Body2: {
        fontFamily: FontFamily,
        fontSize: '14px',
        textTransform: 'none',
        letterSpacing: '0.25px',
        fontWeight: FontWeigt.Regular,
    },
    Button: {
        fontFamily: FontFamily,
        fontSize: '14px',
        textTransform: 'uppercase',
        letterSpacing: '1.25px',
        fontWeight: FontWeigt.Medium,
    },
    Caption: {
        fontFamily: FontFamily,
        fontSize: '12px',
        textTransform: 'none',
        letterSpacing: '0.4px',
        fontWeight: FontWeigt.Regular,
    },
    Overline: {
        fontFamily: FontFamily,
        fontSize: '10px',
        textTransform: 'none',
        letterSpacing: '1.5px',
        fontWeight: FontWeigt.Regular,
    },
    Bold: {
        fontWeight: FontWeigt.Bold,
    },
};

const Shadow: CSS.Properties = {
    boxShadow: '0 .15rem 1.75rem 0 rgba(58, 59, 69, .15)',
};

export {
    White,
    Black,
    Grey,
    Green,
    Red,
    Orange,
    Yellow,
    Blue,
    OpacityHex,
    Primary,
    TypoGraphy,
    Shadow,
};
