import React, { Component } from 'react';

type TableType = {
    datasource?: string;
    className?: string;
    data?: any;
    children?: React.ReactChild[] | React.ReactChild | Element | Element[];
};

class Table extends Component<TableType> {
    render() {
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
}

export default Table;
