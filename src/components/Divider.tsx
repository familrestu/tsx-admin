import React from 'react';

type DividerHorizontalProps = {
    marginTop?: boolean;
    marginBottom?: boolean;
};

const DividerHorizontal = (props: DividerHorizontalProps) => {
    let className = 'navbar-divider-horizontal my-0';
    if (
        typeof props.marginTop !== 'undefined' ||
        typeof props.marginBottom !== 'undefined'
    ) {
        if (props.marginTop) {
            className += ' mt-3';
        }

        if (props.marginBottom) {
            className += ' mb-3';
        }
    }

    return <hr className={className} />;
};

type DividerVerticalProps = {
    marginRight?: boolean;
    marginLeft?: boolean;
};

const DividerVertical = (props: DividerVerticalProps) => {
    let className = 'navbar-divider-vertical my-0';
    if (
        typeof props.marginRight !== 'undefined' ||
        typeof props.marginLeft !== 'undefined'
    ) {
        if (props.marginRight) {
            className += ' mr-3';
        }

        if (props.marginLeft) {
            className += ' ml-3';
        }
    }

    return <hr className={className} />;
};

export { DividerHorizontal, DividerVertical };
