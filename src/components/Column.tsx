import React, { Component } from 'react';

type ColumnType = {
    label: string;
    name: string | number;
    header?: Array<any>;
    body?: Array<any>;
    width?: number | string;
};

class Column extends Component<ColumnType> {
    getColumn() {
        const row = [];
        if (this.props.header && this.props.body) {
            const index = this.props.header.indexOf(this.props.name);

            row.push(
                <div key={`header-${this.props.name}`} className="row-header">
                    {this.props.label}
                </div>,
            );

            if (this.props.body[index]) {
                for (let i = 0; i < this.props.body[index].length; i++) {
                    const body = this.props.body[index][i];
                    row.push(
                        <div key={`body-${this.props.name}-${i}`} className="row-body" style={this.props.width ? { width: `${this.props.width}px` } : {}}>
                            {body}
                        </div>,
                    );
                }
            }
        }

        return row;
    }

    render() {
        // console.log(this.props);
        return <div className="row-group">{this.getColumn()}</div>;
    }
}

export default Column;
