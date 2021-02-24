import React from 'react';

type FieldsetPropsType = {
    label: string;
    children?: React.ReactNode;
};

const Fieldset = (props: FieldsetPropsType) => {
    return (
        <fieldset id={props.label.toLowerCase().replaceAll(' ', '-')} className="fieldset">
            <legend className="fieldset-legend">{props.label}</legend>
            {props.children}
        </fieldset>
    );
};

export default Fieldset;
