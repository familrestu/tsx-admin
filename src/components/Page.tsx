import React from 'react';
import Icon from 'components/Icon';
import SimpleBar from 'simplebar-react';
import CSS from 'csstype';
import ReactDOM from 'react-dom';

type PageProps = {
    breadCrumb?: string;
    style?: CSS.Properties;
    children?: React.ReactChild[] | React.ReactChild | Element | Element[];
};

type PageState = {
    maxHeight: number;
    showBreadCrumb: boolean;
};

class Page extends React.Component<PageProps, PageState> {
    _BreadCrumbContainer: HTMLDivElement | null | undefined;
    _Page: HTMLDivElement | null | undefined;

    state = {
        maxHeight: 0,
        showBreadCrumb: true,
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
                <div id="bread-crumb" className="bread-crumb font-large pt-3 pb-3" ref={(ref) => (this._BreadCrumbContainer = ref)}>
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
        const headerElement = document.getElementById('header-container');

        let maxHeight = 0;
        let breadCrumbHeight = 0;
        let headerHeight = 0;

        if (this._BreadCrumbContainer) {
            if (this._BreadCrumbContainer.parentElement?.id === 'page') {
                const breadcrumbElement = document.getElementById('bread-crumb');

                if (headerElement || breadcrumbElement) {
                    breadCrumbHeight = breadcrumbElement ? breadcrumbElement.offsetHeight : 0;
                    headerHeight = headerElement ? headerElement.offsetHeight : 0;
                    maxHeight = window.innerHeight - headerHeight - breadCrumbHeight - 16;
                }
            }
        } else {
            maxHeight = window.innerHeight - headerHeight - 16;
        }

        if (maxHeight !== 0) {
            this.setState((prevState) => {
                return { ...prevState, maxHeight: maxHeight };
            });
        }
    }

    SetBreadcrumbForModal() {
        if (this._Page) {
            if (this._Page.parentElement && this._Page.parentElement.id === 'modal-body') {
                const BreadcrumbModal = () => <React.Fragment>{this.PrintBreadCrumb()}</React.Fragment>;
                if (this._Page.parentElement.previousElementSibling && this._Page.parentElement.previousElementSibling.children[0]) {
                    ReactDOM.render(<BreadcrumbModal />, this._Page.parentElement.previousElementSibling.children[0]);
                }

                /* hardcode 90% follow css, because it's kinda hard to get this modal height before fully loaded */
                const maxHeight = window.innerHeight * (90 / 100) - 127 - 32;

                this.setState((prevState) => {
                    return { ...prevState, showBreadCrumb: false, maxHeight: maxHeight };
                });
            }
        }
    }

    componentDidMount() {
        this.SetSimpleBarMaxDimensions();
        this.SetBreadcrumbForModal();
    }

    render() {
        const Breadcrumb = () => this.PrintBreadCrumb();

        return (
            <div id="page" className="page" ref={(ref) => (this._Page = ref)}>
                {this.state.showBreadCrumb && <Breadcrumb />}
                <SimpleBar style={{ minHeight: `${this.state.maxHeight}px`, maxHeight: `${this.state.maxHeight}px`, maxWidth: `100%` }} id="simplebar-page">
                    <div id="body-content" className="body-content" style={{ ...this.props.style, minHeight: `${this.state.maxHeight}px` }}>
                        {this.props.children}
                    </div>
                </SimpleBar>
            </div>
        );
    }
}

export default Page;
