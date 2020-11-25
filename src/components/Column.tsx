import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import moment from 'moment';

type ColumnType = {
    label: string;
    name: string | number;
    width?: number | string;
    type?: 'date' | 'link' | 'text';
    link?: string;
    format?: string;

    header?: Array<any> /* table data */;
    body?: Array<any> /* table data */;
};

class Column extends Component<ColumnType> {
    getColumn() {
        const row: Array<any> = [];

        // console.log(window.location.pathname);

        row.push(
            <div key={`header-${this.props.name}`} className="row-header" style={this.props.width ? { width: `${this.props.width}px` } : {}}>
                {this.props.label}
            </div>,
        );

        if (this.props.header && this.props.body) {
            const index = this.props.header.indexOf(this.props.name);

            if (this.props.body[index]) {
                for (let i = 0; i < this.props.body[index].length; i++) {
                    const value = this.props.body[index][i];
                    let ValueElement;

                    if (this.props.type === 'date') {
                        let format = '';

                        if (this.props.format) {
                            format = this.props.format;
                        } else {
                            format = 'DD MMM, YYYY';
                        }

                        ValueElement = () => {
                            return <React.Fragment>{moment(value).format(format).toString()}</React.Fragment>;
                        };
                    } else if (this.props.type === 'link' && this.props.link !== undefined) {
                        ValueElement = () => {
                            let link = this.props.link as string;
                            if (this.props.link) {
                                const replaceThis = this.props.link.match(/\[(.*?)\]/);
                                if (replaceThis && this.props.header) {
                                    // console.log(replaceThis[0]);
                                    const id = replaceThis[0].replace('[', '').replace(']', '');
                                    const indexOfId = this.props.header.indexOf(id);
                                    // console.log(indexOfId);

                                    if (this.props.body && indexOfId && indexOfId >= 0) {
                                        const idValue = this.props.body[indexOfId][i];
                                        // link += '/' + idValue;
                                        link = link.replace(replaceThis[0], idValue);
                                    } else {
                                        link = link.replace(replaceThis[0], '');
                                    }
                                }

                                return <NavLink to={`${link}`}> {value} </NavLink>;
                            } else {
                                return <React.Fragment>{value}</React.Fragment>;
                            }
                        };
                    } else {
                        ValueElement = () => {
                            return <React.Fragment>{value}</React.Fragment>;
                        };
                    }

                    row.push(
                        <div key={`body-${this.props.name}-${i}`} className="row-body" style={this.props.width ? { width: `${this.props.width}px` } : {}}>
                            <ValueElement />
                        </div>,
                    );
                }
            }
        } else {
            for (let i = 0; i < 5; i++) {
                row.push(
                    <div key={`body-${this.props.name}-${i}`} className="row-body loading" style={this.props.width ? { width: `${this.props.width}px` } : {}}>
                        &nbsp;
                    </div>,
                );
            }
        }

        return row;
    }

    render() {
        return <div className="row-group">{this.getColumn()}</div>;
    }
}

export default Column;
