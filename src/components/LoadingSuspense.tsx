import React, { Component } from 'react';
import Page from 'components/Page';
import 'assets/styles/suspense.scss';

type LoadingSuspensePropsType = {
    SuspenseType?: string | null;
};

class LoadingSuspense extends Component<LoadingSuspensePropsType> {
    GetDashboardLoading() {
        const arrElement: JSX.Element[] = [];

        for (let x = 1; x <= 8; x++) {
            arrElement.push(<div key={`sekeleton-${x}`} className="skeleton dashboard-skeleton"></div>);
        }

        return arrElement;
    }

    SetBreadcrumbSekeleton() {
        const breadCrumb = document.getElementById('bread-crumb');
        if (breadCrumb) {
            breadCrumb.classList.add('suspense');
            breadCrumb.classList.add('loading');
        }
    }

    componentDidMount() {
        this.SetBreadcrumbSekeleton();
    }

    render() {
        let Skeleton: Element | Element[] | JSX.Element | JSX.Element[] = <></>;

        if (this.props.SuspenseType) {
            if (this.props.SuspenseType === 'dashboard') {
                Skeleton = this.GetDashboardLoading();
            }
        }

        return (
            <Page breadCrumb="skeleton">
                <div className="suspense loading">{Skeleton}</div>
            </Page>
        );
    }
}

export default LoadingSuspense;
