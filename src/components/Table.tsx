import axios from 'axios';
import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import ReactDOM from 'react-dom';

type ToolbarPropsType = {
    access?: 1 | 2 | 3 | 4 | 'read' | 'write' | 'update' | 'delete';
};

class Toolbar extends Component<ToolbarPropsType> {
    render() {
        return (
            <div className="toolbar-wrapper" id="toolbar-wrapper">
                <Button>
                    <i className="fas fa-file-excel"></i>
                </Button>
                <Button>
                    <i className="fas fa-file-pdf"></i>
                </Button>
            </div>
        );
    }
}

type TablePropsType = {
    datasource?: string;
    className?: string;
    data?: any;
    children?: React.ReactChild[] | React.ReactChild | Element | Element[];
};

type TableStateType = {
    cloneChildren?: any;
    data?: Array<any>;
};

class Table extends Component<TablePropsType, TableStateType> {
    _isMounted = false;

    state = {
        cloneChildren: [],
        data: [],
    };

    FetchData() {
        if (this.props.datasource) {
            let path: string;
            if (this.props.datasource.split('/').length < 3) {
                path = `${process.env.REACT_APP_API_PATH}/${this.props.datasource}/Listing`;
            } else {
                path = `${process.env.REACT_APP_API_PATH}/${this.props.datasource}`;
            }

            if (this.state.cloneChildren.length === 0) {
                axios
                    .post(path, null, {
                        withCredentials: true,
                    })
                    .then((res) => {
                        if (res.data) {
                            const tempArr: any[] = [];

                            React.Children.map(this.props.children, (child, index) => {
                                if (React.isValidElement(child)) {
                                    tempArr.push(React.cloneElement(child, { ...res.data, key: `childs-${index}` }));
                                }
                            });

                            if (this._isMounted) {
                                this.setState((prevState) => {
                                    return { ...prevState, cloneChildren: [...tempArr], data: [...res.data.body] };
                                });
                            }
                        }
                    });
            }
        }
    }

    AddToolBarDOM() {
        const breadCrumbRight = document.getElementById('bread-crumb-right');
        if (breadCrumbRight) {
            ReactDOM.render(<Toolbar />, breadCrumbRight);
        }
    }

    BuildNumber() {
        const arrNo = [];
        for (let x = 0; x < this.state.data.length; x++) {
            const element: Array<any> = this.state.data[x];
            if (element) {
                for (let i = 0; i < element.length; i++) {
                    arrNo.push(
                        <div key={`body-number-${i}`} className="row-body">
                            {i + 1000}.
                        </div>,
                    );
                }
                break;
            }
        }

        return (
            <div className="row-group">
                <div className="row-header">No</div>
                {arrNo}
            </div>
        );
    }

    componentDidMount() {
        this._isMounted = true;
        this.FetchData();
        this.AddToolBarDOM();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        return (
            <div className={`table${this.props.className ? ` table-${this.props.className}` : ''}`}>
                {this.BuildNumber()}
                {this.state.cloneChildren.length > 0 ? this.state.cloneChildren : this.props.children}
            </div>
        );
    }
}

export default Table;
