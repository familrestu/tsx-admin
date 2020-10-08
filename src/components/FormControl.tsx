import React from 'react';
import { FormControl as BootstrapFormControl } from 'react-bootstrap';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FormControl = (props: any) => {
    let returnElement = null;
    if (props.formrequired) {
        returnElement = (
            <div className="d-flex">
                <BootstrapFormControl {...props} />
                <span className="text-danger m-1 bold">*</span>
            </div>
        );
    } else {
        returnElement = <BootstrapFormControl {...props} />;
    }

    return returnElement;
};

export default FormControl;
