import React from 'react';
import Icon from 'components/Icon';
import SimpleBar from 'simplebar-react';

type PageProps = {
    breadCrumb?: string;
    children?: React.ReactChild[] | React.ReactChild | Element | Element[];
};

class Page extends React.Component<PageProps> {
    PrintBreadCrumb() {
        const element = [];

        if (this.props.breadCrumb !== undefined) {
            if (this.props.breadCrumb !== '' && this.props.breadCrumb.length > 2) {
                const arrBC = this.props.breadCrumb.split('|');

                for (let i = 0; i < arrBC.length; i++) {
                    const string = arrBC[i];
                    element.push(
                        <span key={`bc-text-${i}`} className="m-1">
                            {string}
                        </span>,
                    );

                    if (i !== arrBC.length - 1) {
                        element.push(<Icon key={`bc-divider-${i}`} name="fas fa-chevron-right pt-1 ml-1" fontSize="1rem"></Icon>);
                    }
                }
            }
        }

        return (
            <div id="bread-crumb" className="bread-crumb font-large mt-3 mb-3">
                {element}
            </div>
        );
    }

    render() {
        return (
            <React.Fragment>
                {this.PrintBreadCrumb()}
                <SimpleBar style={{ maxHeight: '83vh', overflowX: 'hidden' }}>
                    <div id="body-content" className="body-content">
                        {this.props.children}
                    </div>
                </SimpleBar>
            </React.Fragment>
        );
    }
}

export default Page;
