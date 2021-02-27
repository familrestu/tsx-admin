import React from 'react';
import { useLocation } from 'react-router-dom';
import Page from 'components/Page';

const Printpreview = () => {
    const location = useLocation<{ tab: string }>();
    console.log(location);
    return <Page>test</Page>;
};

export default Printpreview;
