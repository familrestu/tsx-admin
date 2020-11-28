import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import ReactDOM from 'react-dom';
import axios from 'axios';

type ToolbarPropsType = {
    access?: 1 | 2 | 3 | 4 | 'read' | 'write' | 'update' | 'delete';
};

class Toolbar extends Component<ToolbarPropsType> {
    render() {
        return (
            <div className="toolbar-wrapper" id="toolbar-wrapper">
                <Button title="Export to MS Excel">
                    <i className="fas fa-file-excel"></i>
                </Button>
                <Button title="Export to PDF">
                    <i className="fas fa-file-pdf"></i>
                </Button>
                <Button title="Print Preview">
                    <i className="fas fa-print"></i>
                </Button>
            </div>
        );
    }
}

type tableDataType = {
    header: string[];
    body: string[][];
};

type TablePropsType = {
    datasource: string;
    className?: string;
    children?: React.ReactChild[] | React.ReactChild | Element | Element[];
};

type TableStateType = {
    arrTableData?: tableDataType;
    arrCloneChildren?: React.ReactElement[];
    arrNumberElement?: Element[];
    arrSortColumn?: string[];
    arrSortType?: string[];
    arrSearchData?: { [key: string]: string }[];
};

class Table extends Component<TablePropsType, TableStateType> {
    _isMounted = false;

    state: TableStateType = {
        arrTableData: {
            header: [],
            body: [],
        },
        arrCloneChildren: [],
        arrNumberElement: [],
        arrSortColumn: [],
        arrSortType: [],
        arrSearchData: [],
    };

    SetLoadingRow(remove: boolean) {
        const rowBody = document.querySelectorAll('.table .row-body');
        if (rowBody) {
            for (let i = 0; i < rowBody.length; i++) {
                const element = rowBody[i];
                if (remove) {
                    element.classList.remove('loading');
                } else {
                    element.classList.add('loading');
                }
            }
        }
    }

    AddSortClickHandler(column: string, sorting: string) {
        this.SetLoadingRow(false);

        if (this.state.arrSortColumn && this.state.arrSortType) {
            const tempArrSortColumn: string[] = [...this.state.arrSortColumn];
            const tempArrSortType: string[] = [...this.state.arrSortType];

            if (this.state.arrTableData !== undefined) {
                /* find index of column */
                const columnIndex = tempArrSortColumn.indexOf(column);

                if (sorting !== '') {
                    if (columnIndex < 0) {
                        tempArrSortColumn.push(column);
                        tempArrSortType.push(sorting);
                    } else {
                        tempArrSortType[columnIndex] = sorting;
                    }
                } else {
                    tempArrSortColumn.splice(columnIndex);
                    tempArrSortType.splice(columnIndex);
                }

                this.setState(
                    (prevState) => {
                        return {
                            ...prevState,
                            arrSortColumn: tempArrSortColumn,
                            arrSortType: tempArrSortType,
                        };
                    },
                    () => this.FetchData(false),
                );
            }
        }
    }

    FetchData(initial: boolean) {
        if (this.props.datasource && this.state.arrTableData) {
            let path: string;
            if (this.props.datasource.split('/').length < 3) {
                path = `${process.env.REACT_APP_API_PATH}/${this.props.datasource}/Listing`;
            } else {
                path = `${process.env.REACT_APP_API_PATH}/${this.props.datasource}`;
            }

            const maxLength = this.GetDataMaxLength(this.state.arrTableData.body);

            if (initial) {
                const row: Array<any> = [];
                for (let i = 0; i < (maxLength === 0 ? 5 : maxLength); i++) {
                    row.push(
                        <div key={`body-no-${i}`} className="row-body loading">
                            <span>&nbsp;</span>
                        </div>,
                    );
                }

                if (this._isMounted) {
                    this.setState((prevState) => {
                        return { ...prevState, arrNumberElement: [...row] };
                    });
                }
            }

            axios
                .post(
                    path,
                    {
                        arrSortColumn: this.state.arrSortColumn,
                        arrSortType: this.state.arrSortType,
                        arrSearchData: this.state.arrSearchData,
                    },
                    {
                        withCredentials: true,
                    },
                )
                .then((res) => {
                    if (res.data && res.data.datasets) {
                        // console.log(res.data);
                        const { datasets } = res.data;
                        this.CloneChildren(datasets);
                        this.SetLoadingRow(true);
                    }
                })
                .catch((err) => {
                    /* set no data */
                    console.log(err);
                    this.CloneChildren({ header: [], body: [] });
                });
            // }
        }
    }

    GetDataMaxLength(arrBodyData: string[][]) {
        let maxLength = 0;
        for (let i = 0; i < arrBodyData.length; i++) {
            const body = arrBodyData[i];
            maxLength = Math.max(maxLength, body.length);
        }
        return maxLength;
    }

    CloneChildren(datasets: tableDataType) {
        const tempArr: any[] = [];

        const arrarrNumberElement: any[] = [];
        const arrBodyData: string[][] = datasets.body;
        const arrHeaderData: string[] = datasets.header;
        const maxLength = this.GetDataMaxLength(arrBodyData);

        for (let i = 1; i <= maxLength; i++) {
            arrarrNumberElement.push(
                <div key={`body-number-${i}`} className="row-body">
                    <span>{i}.</span>
                </div>,
            );
        }

        React.Children.map(this.props.children, (child, index) => {
            if (React.isValidElement(child)) {
                tempArr.push(
                    React.cloneElement(child, {
                        header: arrHeaderData,
                        body: arrBodyData,
                        arrSortColumn: this.state.arrSortColumn,
                        arrSortType: this.state.arrSortType,
                        maxLength,
                        key: `childs-${index}`,
                        AddSortClickHandler: (column: string, sorting: string) => this.AddSortClickHandler(column, sorting),
                    }),
                );
            }
        });

        if (this._isMounted) {
            this.setState((prevState) => {
                return {
                    ...prevState,
                    arrCloneChildren: [...tempArr],
                    arrNumberElement: arrarrNumberElement,
                    arrTableData: {
                        header: arrHeaderData,
                        body: arrBodyData,
                    },
                };
            });
        }
    }

    AddToolBarDOM() {
        const breadCrumbRight = document.getElementById('bread-crumb-right');
        if (breadCrumbRight) {
            ReactDOM.render(<Toolbar />, breadCrumbRight);
        }
    }

    componentDidMount() {
        this._isMounted = true;
        this.FetchData(true);
        this.AddToolBarDOM();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    NewChildren() {
        if (this.state.arrCloneChildren && this.state.arrCloneChildren.length > 0) {
            return this.state.arrCloneChildren;
        } else {
            return this.props.children;
        }
    }

    render() {
        return (
            <div className={`table${this.props.className ? ` table-${this.props.className}` : ''}`}>
                <div className="row-group">
                    <div className="row-header">#</div>
                    {this.state.arrNumberElement}
                </div>
                {this.NewChildren()}
            </div>
        );
    }
}

export default Table;
