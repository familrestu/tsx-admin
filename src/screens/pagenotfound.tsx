import React from 'react';
import Page from 'components/Page';

const NotAuthorized = () => {
    return (
        <Page>
            <div className="pt-4">{`Page Not Found or You're not Authorized`}</div>
        </Page>
    );
};

export default NotAuthorized;
