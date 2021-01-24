import React, { Component } from 'react';

import { Col, Row } from 'react-bootstrap';
import Page from 'components/Page';
import Form from 'components/Form';
import Input from 'components/Input';

type LoadingSuspensePropsType = {
    SuspenseType?: string | null;
};

class LoadingSuspense extends Component<LoadingSuspensePropsType> {
    SetDashboardSkeleton() {
        const arrElement: JSX.Element[] = [];
        const arrRow: JSX.Element[] = [];

        for (let x = 1; x <= 4; x++) {
            arrElement.push(
                <div key={`row-col-dash-1-${x}`} className="col-xl-3 col-sm-6">
                    <div className="card card-skeleton skeleton"></div>
                </div>,
            );
        }

        arrRow.push(
            <Col key={`row-dash-1`} className="p-0 m-1 mb-1">
                <Row>{arrElement}</Row>
            </Col>,
        );

        arrRow.length = 0;

        for (let x = 1; x <= 4; x++) {
            arrElement.push(
                <div key={`row-col-dash-2-${x}`} className="col-xl-6 col-sm-12 mt-2">
                    <div className="card card-skeleton skeleton" style={{ height: '15rem' }}></div>
                </div>,
            );
        }

        arrRow.push(
            <Col key={`row-dash-2`} className="p-0 m-1">
                <Row>{arrElement}</Row>
            </Col>,
        );

        return arrRow;
    }

    SetTableSkeleton() {
        const columnBody: JSX.Element[] = [];

        for (let x = 0; x < 10; x++) {
            const rowBody: JSX.Element[] = [];
            for (let i = 0; i < 10; i++) {
                if (i === 0) {
                    rowBody.push(
                        <div key={`row-header-${x}`} className="row-header" style={{ width: x === 0 ? '3rem' : '' }}>
                            <span>&nbsp;</span>
                        </div>,
                    );
                }
                rowBody.push(
                    <div key={`row-body-${x}-${i}`} className="row-body" style={{ width: x === 0 ? '3rem' : '' }}>
                        <span>&nbsp;</span>
                    </div>,
                );
            }

            columnBody.push(
                <div key={`col-${x}`} className="column-group">
                    {rowBody}
                </div>,
            );
        }

        const arrElement: JSX.Element | null = (
            <div className="table loading suspense" id="table">
                {columnBody}
            </div>
        );

        return arrElement;
    }

    SetFormSkeleton() {
        return (
            <Form>
                <Input type="text" label="xxxx" size="4" placeholder=" " name=" " readOnly />
                <Input type="text" label="xxxx" size="4" placeholder=" " name=" " readOnly />
                <Row>
                    <Input type="text" size={3} row="false" label=" " placeholder=" " name=" " formrequired="true" />
                    <Input type="text" size={3} row="false" label=" " placeholder=" " name=" " />
                    <Input type="text" size={3} row="false" label=" " placeholder=" " name=" " formrequired="true" />
                </Row>
                <Input type="text" label="xxxx" size="8" placeholder=" " name=" " readOnly />
                <Input type="text" label="xxxx" size="8" placeholder=" " name=" " readOnly />
            </Form>
        );
    }

    SetBreadcrumbSekeleton() {
        const breadCrumbLeft = document.getElementById('bread-crumb-left');
        const breadCrumbRight = document.getElementById('bread-crumb-right');

        if (breadCrumbLeft) {
            breadCrumbLeft.classList.add('suspense');
            breadCrumbLeft.classList.add('loading');
            const spEl = document.createElement('span');
            spEl.style.width = '100%';
            spEl.style.height = '35px';
            spEl.style.marginRight = '1rem';
            breadCrumbLeft.appendChild(spEl);
        }

        if (this.props.SuspenseType) {
            if (this.props.SuspenseType === 'table') {
                if (breadCrumbRight) {
                    breadCrumbRight.classList.add('suspense');
                    breadCrumbRight.classList.add('loading');
                    const spEl = document.createElement('span');
                    spEl.style.width = '35px';
                    spEl.style.height = '35px';
                    spEl.style.marginLeft = '.5rem';
                    breadCrumbRight.appendChild(spEl);

                    const spEl2 = document.createElement('span');
                    spEl2.style.width = '35px';
                    spEl2.style.height = '35px';
                    spEl2.style.marginLeft = '.5rem';
                    breadCrumbRight.appendChild(spEl2);

                    const spEl3 = document.createElement('span');
                    spEl3.style.width = '35px';
                    spEl3.style.height = '35px';
                    spEl3.style.marginLeft = '.5rem';
                    breadCrumbRight.appendChild(spEl3);
                }
            }
        }
    }

    componentDidMount() {
        this.SetBreadcrumbSekeleton();
    }

    render() {
        let Skeleton: Element | Element[] | JSX.Element | JSX.Element[] | null = <></>;

        if (this.props.SuspenseType) {
            if (this.props.SuspenseType === 'dashboard') {
                Skeleton = this.SetDashboardSkeleton();
            } else if (this.props.SuspenseType === 'table') {
                Skeleton = this.SetTableSkeleton();
            } else if (this.props.SuspenseType === 'form') {
                Skeleton = this.SetFormSkeleton();
            }
        }

        return (
            <Page breadCrumb=" ">
                <div className="suspense loading">{Skeleton}</div>
            </Page>
        );
    }
}

export default LoadingSuspense;
