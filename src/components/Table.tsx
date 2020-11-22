import axios from 'axios';
import React, { Component } from 'react';

type TablePropsType = {
    datasource?: string;
    className?: string;
    data?: any;
    children?: React.ReactChild[] | React.ReactChild | Element | Element[];
};

type TableStateType = {
    tabledata?: Array<any>;
};

class Table extends Component<TablePropsType, TableStateType> {
    NewChildren: React.ReactChild[] = [];

    render_debug() {
        let maxDataLength = 0;
        const num = [];

        if (this.props && this.props.data.body) {
            for (let i = 0; i < this.props.data.body.length; i++) {
                const element = this.props.data.body[i];
                maxDataLength = Math.max(maxDataLength, element.length);
            }

            for (let i = 1; i <= maxDataLength; i++) {
                num.push(
                    <div key={`row-num-${i}`} className="row-body" style={{ minWidth: 'min-content', padding: '.75rem 1.5rem', justifyContent: 'center' }}>
                        {i}.
                    </div>,
                );
            }
        }

        const childrenWithProps = React.Children.map(this.props.children, (child) => {
            if (React.isValidElement(child)) {
                return React.cloneElement(child, { ...this.props.data, maxDataLength });
            }
        });

        return (
            <div className={`table${this.props.className ? ` table-${this.props.className}` : ''}`}>
                <div className="row-group" style={{ minWidth: 'min-content' }}>
                    <div className="row-header" style={{ minWidth: 'min-content', padding: '.75rem 1.5rem' }}>
                        #
                    </div>
                    {num}
                </div>
                {childrenWithProps}
            </div>
        );
    }

    constructor(props: TablePropsType) {
        super(props);
        this.BuildTable();
    }

    BuildTable() {
        if (this.props.datasource) {
            let path: string;
            if (this.props.datasource.split('/').length < 3) {
                path = `${process.env.REACT_APP_API_PATH}/${this.props.datasource}/Listing`;
            } else {
                path = `${process.env.REACT_APP_API_PATH}/${this.props.datasource}`;
            }

            axios.post(path, null, {
                withCredentials: true,
            });
        }

        React.Children.map(this.props.children, (child, index) => {
            if (React.isValidElement(child)) {
                this.NewChildren.push(React.cloneElement(child, { ...this.props.data, key: `childs-${index}` }));
            }
        });
    }

    componentDidMount() {
        // console.log(this.NewChildren);
        /* console.log(this.props.children);
        if (this.props.children) {
            for (let i = 0; i < this.props.children.length; i++) {
                const element = this.props.children[i];
                console.log(element);
            }
        } */
        // this.BuildTable();
    }

    componentDidUpdate() {
        /*  */
    }

    render() {
        return <div className={`table${this.props.className ? ` table-${this.props.className}` : ''}`}>{this.NewChildren}</div>;
    }
}

export default Table;
