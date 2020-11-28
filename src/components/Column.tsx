import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import moment from 'moment';

type ColumnType = {
    label: string;
    name: string;
    width?: number | string;
    type?: 'date' | 'link' | 'text' | string;
    link?: string;
    format?: string;

    header?: string[] /* table data */;
    body?: string[] /* table data */;
    arrSortColumn?: string[] /* table data */;
    arrSortType?: string[] /* table data */;
    maxLength?: number;
    AddSortClickHandler?: (column: string, sorting: string) => void;
};

class Column extends Component<ColumnType> {
    SortAscendingHandler(e: React.MouseEvent, name: string) {
        if (this.props.AddSortClickHandler) {
            const target = e.currentTarget;
            const sibling = target.nextElementSibling;

            if (target.classList.value.indexOf('active') >= 0) {
                target.classList.remove('active');
                this.props.AddSortClickHandler(name, '');
            } else {
                target.classList.add('active');
                this.props.AddSortClickHandler(name, 'asc');
            }

            if (sibling) {
                sibling.classList.remove('active');
            }
        }
    }

    SortDescendingHandler(e: React.MouseEvent, name: string) {
        if (this.props.AddSortClickHandler) {
            const target = e.currentTarget;
            const sibling = target.previousElementSibling;

            if (target.classList.value.indexOf('active') >= 0) {
                target.classList.remove('active');
                this.props.AddSortClickHandler(name, '');
            } else {
                target.classList.add('active');
                this.props.AddSortClickHandler(name, 'desc');
            }

            if (sibling) {
                sibling.classList.remove('active');
            }
        }
    }

    getColumn() {
        const row: Array<any> = [];
        let activeAsc = false;
        let activeDesc = false;

        if (this.props.arrSortColumn && this.props.arrSortType) {
            const columnIndex = this.props.arrSortColumn.indexOf(this.props.name);
            if (columnIndex >= 0) {
                if (this.props.arrSortType[columnIndex] === 'asc') {
                    activeAsc = true;
                    activeDesc = false;
                } else {
                    activeAsc = false;
                    activeDesc = true;
                }
            }
        }

        row.push(
            <div key={`header-${this.props.name}`} className="row-header" style={this.props.width ? { width: `${this.props.width}px` } : {}}>
                <span className="left">{this.props.label}</span>
                <span className="right">
                    <i className={`fas fa-sort-up${activeAsc ? ' active' : ''}`} onClick={(e) => this.SortAscendingHandler(e, this.props.name as string)}></i>
                    <i className={`fas fa-sort-down${activeDesc ? ' active' : ''}`} onClick={(e) => this.SortDescendingHandler(e, this.props.name as string)}></i>
                </span>
            </div>,
        );

        if (this.props.header && this.props.body) {
            const index = this.props.header.indexOf(this.props.name);

            if (this.props.body[index] && this.props.maxLength) {
                for (let i = 0; i < this.props.maxLength; i++) {
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
                            if (value === undefined || value === null) {
                                return <React.Fragment>asd</React.Fragment>;
                            } else {
                                return <React.Fragment>{moment(value).format(format).toString()}</React.Fragment>;
                            }
                        };
                    } else if (this.props.type === 'link' && this.props.link !== undefined) {
                        ValueElement = () => {
                            if (value === undefined || value === null) {
                                return <React.Fragment>&nbsp;</React.Fragment>;
                            } else {
                                let link = this.props.link as string;
                                if (this.props.link) {
                                    const replaceThis = this.props.link.match(/\[(.*?)\]/);
                                    if (replaceThis && this.props.header) {
                                        const id = replaceThis[0].replace('[', '').replace(']', '');
                                        const indexOfId = this.props.header.indexOf(id);

                                        if (this.props.body && indexOfId !== undefined && indexOfId >= 0) {
                                            const idValue = this.props.body[indexOfId][i];
                                            link = link.replace(replaceThis[0], idValue);
                                        } else {
                                            link = link.replace(replaceThis[0], '');
                                        }
                                    }

                                    return <NavLink to={`${link}`}> {value} </NavLink>;
                                } else {
                                    return <React.Fragment>{value}</React.Fragment>;
                                }
                            }
                        };
                    } else {
                        ValueElement = () => {
                            if (value === undefined || value === null) {
                                return <React.Fragment>&nbsp;</React.Fragment>;
                            } else {
                                return <React.Fragment>{value}</React.Fragment>;
                            }
                        };
                    }

                    row.push(
                        <div key={`body-${this.props.name}-${i}`} className="row-body" style={this.props.width ? { width: `${this.props.width}px` } : {}}>
                            <span>
                                <ValueElement />
                            </span>
                        </div>,
                    );
                }
            }
        } else {
            for (let i = 0; i < 5; i++) {
                row.push(
                    <div key={`body-${this.props.name}-${i}`} className="row-body loading" style={this.props.width ? { width: `${this.props.width}px` } : {}}>
                        <span>&nbsp;</span>
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
