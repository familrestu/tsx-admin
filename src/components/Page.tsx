import React from 'react';
import Icon from 'components/Icon';
import SimpleBar from 'simplebar-react';

type PageProps = {
    breadCrumb?: string;
    children?: React.ReactChild[] | React.ReactChild | Element | Element[];
};

class Page extends React.Component<PageProps> {
    BreadCrumbRight: HTMLDivElement | null | undefined;

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
            <div id="bread-crumb" className="bread-crumb font-large pt-3 pb-3">
                <div className="bread-crumb-left" id="bread-crumb-left">
                    {element}
                </div>
                <div className="bread-crumb-right" id="bread-crumb-right" ref={(ref) => (this.BreadCrumbRight = ref)}></div>
            </div>
        );
    }

    render() {
        let maxWidth = 0;
        let maxHeight = 0;
        const headerElement = document.getElementById('header');
        const breadcrumbElement = document.getElementById('bread-crumb');
        const navbarElement = document.getElementById('navbar-left');

        if (headerElement && breadcrumbElement && navbarElement) {
            maxHeight = window.innerHeight - headerElement.offsetHeight - breadcrumbElement.offsetHeight - 16;
            maxWidth = window.outerWidth - navbarElement.offsetWidth;
        }

        /* const isChildrenTable = (this.props.children as any).type.name.toUpperCase() === 'TABLE';

        return (
            <React.Fragment>
                {this.PrintBreadCrumb()}
                {isChildrenTable ? (
                    <div id="body-content" className="body-content">
                        {this.props.children}
                    </div>
                ) : (
                    <SimpleBar style={{ maxHeight: `${maxHeight}px`, maxWidth: `${maxWidth}px` }}>
                        <div id="body-content" className="body-content">
                            {this.props.children}
                        </div>
                    </SimpleBar>
                )}
            </React.Fragment>
        ); */

        return (
            <React.Fragment>
                {this.PrintBreadCrumb()}
                <SimpleBar style={{ maxHeight: `${maxHeight}px`, maxWidth: `${maxWidth}px` }}>
                    <div id="body-content" className="body-content">
                        {this.props.children}
                    </div>
                </SimpleBar>
            </React.Fragment>
        );
    }
}

export default Page;
