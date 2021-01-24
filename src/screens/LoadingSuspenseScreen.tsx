import React, { Component } from 'react';
import LoadingSuspense from 'components/LoadingSuspense';
// import Page from 'components/Page';

class LoadingSuspenseScreen extends Component {
    render() {
        return <LoadingSuspense SuspenseType="table" />;
    }
}

export default LoadingSuspenseScreen;
