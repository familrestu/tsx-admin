import React from 'react';
import ReactDOM from 'react-dom';
import CSS from 'csstype';

type PageProps = {
    breadCrumb?: string;
    style?: CSS.Properties;
    children?: React.ReactChild[] | React.ReactChild | Element | Element[];
};

type PageState = {
    maxHeight: number;
    showBreadCrumb: boolean;
};

export type PageCloneChildrenPropsType = {
    'page-max-height'?: number;
    'parent-element'?: HTMLDivElement | null;
    'children-number'?: number;
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
                        element.push(<i key={`bc-divider-${i}`} className="fas fa-angle-right m-1" />);
                    }
                }
            }

            if (this._Page && this._Page.parentElement && this._Page.parentElement.id === 'modal-body') {
                return <React.Fragment>{element}</React.Fragment>;
            } else {
                return (
                    <div id="bread-crumb" className="bread-crumb" ref={(ref) => (this._BreadCrumbContainer = ref)}>
                        <div className="bread-crumb-left" id="bread-crumb-left">
                            {element}
                        </div>
                    </div>
                );
            }
        } else {
            return <React.Fragment />;
        }
    }

    SetBreadcrumbForModal() {
        if (this._Page && this._Page.parentElement && this._Page.parentElement.id === 'modal-body') {
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

    componentDidMount() {
        this.SetBreadcrumbForModal();
    }

    render() {
        return (
            <div id="page" className="page" ref={(ref) => (this._Page = ref)}>
                {this.state.showBreadCrumb && this.PrintBreadCrumb()}
                <div id="body-content" className="body-content" style={{ ...this.props.style }}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default Page;
