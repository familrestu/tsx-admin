import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import moment from 'moment';
import { FormControl } from 'react-bootstrap';

let mouseMove: any;
let mouseUp: any;

let isMoving: boolean;
let mover: HTMLDivElement | null | undefined;
let rowGroup: HTMLDivElement | null | undefined;
let currentWidth: number;
let startPos: number | undefined;
let endPos: number | undefined;

const MouseDownResizeHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    mover = e.currentTarget as HTMLDivElement;
    rowGroup = mover.parentElement as HTMLDivElement;
    isMoving = true;
    startPos = e.pageX;
    currentWidth = rowGroup.offsetWidth;

    mover.classList.add('active');

    mouseMove = (event: React.MouseEvent<HTMLDivElement>) => MouseMoveResizeHandler(event);
    mouseUp = (event: React.MouseEvent<HTMLDivElement>) => MouseUpResizeHandler(event);

    window.addEventListener('mousemove', mouseMove);
    window.addEventListener('mouseup', mouseUp);
};

const MouseMoveResizeHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    if (rowGroup && startPos && mover) {
        rowGroup.style.minWidth = `${currentWidth + e.pageX - startPos}px`;
        rowGroup.style.width = `${currentWidth + e.pageX - startPos}px`;
    }
};

const MouseUpResizeHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMoving && rowGroup && startPos && mover) {
        endPos = e.pageX;

        rowGroup.style.minWidth = `${currentWidth + endPos - startPos}px`;
        mover.style.right = `0`;

        isMoving = false;
        rowGroup = undefined;
        startPos = undefined;
        endPos = undefined;

        mover.classList.remove('active');
        window.removeEventListener('mousemove', mouseMove);
    }
};

type ColumnPropsType = {
    label: string;
    name: string;
    width?: number | string;
    type?: 'date' | 'link' | 'text' | 'number' | 'time';
    link?: string;
    format?: string;
    masking?: string;
    align?: 'left' | 'center' | 'right';

    header?: string[] /* table data */;
    body?: string[] /* table data */;
    arrSortColumn?: string[] /* table data */;
    arrSortType?: string[] /* table data */;
    maxLength?: number;
    AddSortClickHandler?: (column: string, sorting: string) => void;
    SearchClickHandler?: (column: string, label: string, value: string, masking?: string) => void;
};

type ColumnStateType = {
    isSearch: boolean;
};

class Column extends Component<ColumnPropsType, ColumnStateType> {
    MouseMoveListener: any;

    state = {
        isSearch: false,
    };

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

    ToggleSearch() {
        this.setState((prevState) => {
            return { ...prevState, isSearch: !prevState.isSearch };
        });
    }

    OnKeyPressSearchHandler(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key.toUpperCase() === 'ENTER') {
            const value = (e.target as HTMLInputElement).value;
            // console.log('enter pressed', value);
            if (this.props.SearchClickHandler) {
                this.props.SearchClickHandler(this.props.name, this.props.label, value);
                this.ToggleSearch();
            }
        } else {
            return true;
        }
    }

    OnChangeSearchHandler(e: React.ChangeEvent<HTMLSelectElement>) {
        const value = e.target.options[e.target.options.selectedIndex].value;
        if (this.props.masking && this.props.SearchClickHandler && value && value !== '') {
            this.props.SearchClickHandler(this.props.name, this.props.label, value, this.props.masking);
            this.ToggleSearch();
        }
    }

    GetColumn() {
        const row: React.ReactElement[] = [];
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

        const InputSearch = () => {
            const arrayListTypeToText: string[] = ['link'];
            let type = '';

            if (arrayListTypeToText.indexOf(type) >= 0) {
                type = 'text';
            } else {
                if (this.props.type === undefined) {
                    type = 'text';
                } else {
                    type = this.props.type;
                }
            }

            if (this.props.masking) {
                const option: React.ReactElement[] = [];
                const arrayMasking: string[] = this.props.masking.split(',');
                if (arrayMasking) {
                    for (let i = 0; i < arrayMasking.length; i++) {
                        const originalValue = arrayMasking[i].split('=')[0];
                        const targetValue = arrayMasking[i].split('=')[1];

                        option.push(
                            <option key={`option-search-masking-${i}-${this.props.name}`} value={originalValue}>
                                {targetValue}
                            </option>,
                        );
                    }
                }

                return (
                    <FormControl
                        size="sm"
                        name={this.props.name}
                        type={type}
                        autoFocus={true}
                        onBlur={() => this.ToggleSearch()}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => this.OnChangeSearchHandler(e)}
                        as="select"
                    >
                        <option value="">Please Select</option>
                        {option}
                    </FormControl>
                );
            } else {
                return (
                    <FormControl
                        size="sm"
                        name={this.props.name}
                        type={type}
                        autoFocus={true}
                        onBlur={() => this.ToggleSearch()}
                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => this.OnKeyPressSearchHandler(e)}
                    />
                );
            }
        };

        row.push(
            <div key={`header-${this.props.name}`} className="row-header">
                <span className="left pointer" onDoubleClick={() => this.ToggleSearch()}>
                    {this.state.isSearch ? <InputSearch /> : this.props.label}
                </span>
                {!this.state.isSearch && (
                    <span className="right">
                        <i className={`fas fa-sort-up ${activeAsc ? 'active' : ''}`.trim()} onClick={(e) => this.SortAscendingHandler(e, this.props.name as string)}></i>
                        <i className={`fas fa-sort-down ${activeDesc ? 'active' : ''}`.trim()} onClick={(e) => this.SortDescendingHandler(e, this.props.name as string)}></i>
                    </span>
                )}
            </div>,
        );

        if (this.props.header && this.props.body) {
            const index = this.props.header.indexOf(this.props.name);

            if (this.props.body[index] && this.props.maxLength) {
                for (let i = 0; i < this.props.maxLength; i++) {
                    let value = this.props.body[index][i];
                    let ValueElement;

                    if (this.props.type === 'date') {
                        let format = '';

                        if (this.props.format) {
                            format = this.props.format;
                        } else {
                            format = 'DD-MM-YYYY';
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
                        /* change value based on masking */
                        if (this.props.masking) {
                            /* split masking as array */
                            const arrayMasking: string[] = this.props.masking.split(',');
                            if (arrayMasking) {
                                for (let i = 0; i < arrayMasking.length; i++) {
                                    const originalValue = arrayMasking[i].split('=')[0];
                                    const targetValue = arrayMasking[i].split('=')[1];

                                    if (value.toString() === originalValue.toString()) {
                                        value = targetValue;
                                        break;
                                    }
                                }
                            }
                        }

                        ValueElement = () => {
                            if (value === undefined || value === null) {
                                return <React.Fragment>&nbsp;</React.Fragment>;
                            } else {
                                return <React.Fragment>{value}</React.Fragment>;
                            }
                        };
                    }

                    let alignmentClassName = 'text-left';
                    if (this.props.align) {
                        alignmentClassName = `text-${this.props.align}`;
                    }

                    row.push(
                        <div key={`body-${this.props.name}-${i}`} className="row-body">
                            <span className={alignmentClassName}>
                                <ValueElement />
                            </span>
                        </div>,
                    );
                }
            }
        } else {
            for (let i = 0; i < 5; i++) {
                row.push(
                    <div key={`body-${this.props.name}-${i}`} className="row-body">
                        <span>&nbsp;</span>
                    </div>,
                );
            }
        }

        return row;
    }

    render() {
        return (
            <div className="column-group" style={this.props.width ? { width: `${this.props.width}px` } : {}}>
                {this.GetColumn()}
                <div className="table-separator" onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => MouseDownResizeHandler(e)}></div>
            </div>
        );
    }
}

export default Column;
