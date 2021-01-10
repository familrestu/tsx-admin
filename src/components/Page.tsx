import React from 'react';
import Icon from 'components/Icon';
import SimpleBar from 'simplebar-react';
import CSS from 'csstype';

type PageProps = {
    breadCrumb?: string;
    style?: CSS.Properties;
    children?: React.ReactChild[] | React.ReactChild | Element | Element[];
};

type PageState = {
    maxHeight: number;
};

class Page extends React.Component<PageProps, PageState> {
    BreadCrumbRight: HTMLDivElement | null | undefined;

    state = {
        maxHeight: 0,
    };

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
                        element.push(<Icon key={`bc-divider-${i}`} name="fas fa-angle-right m-1" fontSize="1rem"></Icon>);
                    }
                }
            }
            return (
                <div id="bread-crumb" className="bread-crumb font-large pt-3 pb-3">
                    <div className="bread-crumb-left" id="bread-crumb-left">
                        {element}
                    </div>
                    <div className="bread-crumb-right" id="bread-crumb-right"></div>
                </div>
            );
        } else {
            return <React.Fragment />;
        }
    }

    SetSimpleBarMaxDimensions() {
        let maxHeight = 0;

        const headerElement = document.getElementById('header-container');
        const breadcrumbElement = document.getElementById('bread-crumb');
        // const navbarElement = document.getElementById('navbar-left');

        if (headerElement || breadcrumbElement) {
            const breadCrumbHeight = breadcrumbElement ? breadcrumbElement.offsetHeight : 0;
            const headerHeight = headerElement ? headerElement.offsetHeight : 0;
            maxHeight = window.innerHeight - headerHeight - breadCrumbHeight - 16;

            this.setState((prevState) => {
                return { ...prevState, maxHeight: maxHeight };
            });
        }
    }

    componentDidMount() {
        this.SetSimpleBarMaxDimensions();
    }

    render() {
        return (
            <React.Fragment>
                {this.PrintBreadCrumb()}
                <SimpleBar style={{ minHeight: `${this.state.maxHeight}px`, maxHeight: `${this.state.maxHeight}px`, maxWidth: `100%` }} id="simplebar-page">
                    <div id="body-content" className="body-content" style={{ ...this.props.style, minHeight: `${this.state.maxHeight}px` }}>
                        {this.props.children}
                    </div>
                </SimpleBar>
            </React.Fragment>
        );
    }
}

export default Page;
