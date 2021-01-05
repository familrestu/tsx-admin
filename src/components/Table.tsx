import React, { Component, createRef } from 'react';
import { Button, Badge } from 'react-bootstrap';
import ReactDOM from 'react-dom';
import axios from 'axios';

const apiPath = process.env.REACT_APP_API_PATH || 'https://api.familrestu.com';

type ToolbarPropsType = {
    access?: 1 | 2 | 3 | 4 | 'read' | 'write' | 'update' | 'delete';
    ClearFilter?: () => void;
};

type TableDataType = {
    header: string[];
    body: string[][];
};

type TablePropsType = {
    datasource?: string;
    className?: string;
    id?: string;
    children?: React.ReactChild[] | React.ReactChild | Element | Element[];
};

type TableStateType = {
    arrTableData?: TableDataType;
    arrCloneChildren?: React.ReactElement[];
    arrNumberElement?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>[];
    arrSortColumn?: string[];
    arrSortType?: string[];
    arrSearchData?: { [key: string]: string }[];
};

class Toolbar extends Component<ToolbarPropsType & TablePropsType & TableStateType> {
    ExportToMsExcelHandler() {
        console.log(this.props.arrTableData);
    }

    render() {
        return (
            <div className="toolbar-wrapper" id="toolbar-wrapper">
                {/* <Button title="Filter">
                    <i className="fas fa-filter"></i>
                </Button> */}
                {this.props.arrSearchData && this.props.arrSearchData.length > 0 && (
                    <Button title="Clear Filter" style={{ position: 'relative' }} onClick={() => (this.props.ClearFilter !== undefined ? this.props.ClearFilter() : null)}>
                        <i className="fas fa-filter"></i>
                        <i className="fas fa-times-circle position-absolute" style={{ right: '.25rem', bottom: '.25rem', fontSize: '.75rem' }}></i>
                    </Button>
                )}
                <Button title="Export to MS Excel" onClick={() => this.ExportToMsExcelHandler()}>
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

class Table extends Component<TablePropsType, TableStateType> {
    _isMounted = false;
    _Table = createRef<HTMLDivElement>();

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
        if (this._Table) {
            const element = this._Table;

            if (element.current !== null) {
                if (remove) {
                    element.current.classList.remove('loading');
                } else {
                    element.current.classList.add('loading');
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
                    () => this.FetchTableData(false),
                );
            }
        }
    }

    SearchClickHandler(column: string, label: string, value: string, masking?: string) {
        if (this.state.arrSearchData) {
            this.SetLoadingRow(false);
            const tempArr: { [key: string]: string }[] = [...this.state.arrSearchData];
            const obj: { [key: string]: string } = {
                column: column,
                label: label,
                value: value,
            };

            if (masking) {
                /* split masking as array */
                const arrayMasking: string[] = masking.split(',');
                if (arrayMasking) {
                    for (let i = 0; i < arrayMasking.length; i++) {
                        const originalValue = arrayMasking[i].split('=')[0];
                        const targetValue = arrayMasking[i].split('=')[1];

                        if (value.toString() === originalValue.toString()) {
                            obj.maskingValue = targetValue;
                            break;
                        }
                    }
                }
            }

            tempArr.push(obj);

            this.setState(
                (prevState) => {
                    return { ...prevState, arrSearchData: tempArr };
                },
                () => this.FetchTableData(false),
            );
        }
    }

    RemoveSearchClickHandler(indexNum: number) {
        if (this.state.arrSearchData) {
            this.SetLoadingRow(false);

            const tempArr: { [key: string]: string }[] = [...this.state.arrSearchData];
            tempArr.splice(indexNum, 1);

            this.setState(
                (prevState) => {
                    return { ...prevState, arrSearchData: tempArr };
                },
                () => this.FetchTableData(false),
            );
        }
    }

    ClearFilter() {
        if (this.state.arrSearchData) {
            this.SetLoadingRow(false);
            this.setState(
                (prevState) => {
                    return { ...prevState, arrSearchData: [] };
                },
                () => this.FetchTableData(false),
            );
        }
    }

    FetchTableData(initial: boolean) {
        if (this.props.datasource && this.state.arrTableData) {
            let path: string;
            if (this.props.datasource.split('/').length < 3) {
                path = `${apiPath}/${this.props.datasource}/TableData`;
            } else {
                path = `${apiPath}/${this.props.datasource}`;
            }

            const maxLength = this.GetDataMaxLength(this.state.arrTableData.body);

            if (initial) {
                const row: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>[] = [];
                for (let i = 0; i < (maxLength === 0 ? 5 : maxLength); i++) {
                    row.push(
                        <div key={`body-no-${i}`} className="row-body">
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
                        const { datasets } = res.data;
                        this.CloneChildren(datasets);
                        this.SetLoadingRow(true);
                        this.AddToolBarDOM();
                    }
                })
                .catch((err) => {
                    /* set no data */
                    console.log(err);
                    this.CloneChildren({ header: [], body: [] });
                    this.SetLoadingRow(true);
                });
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

    CloneChildren(datasets: TableDataType) {
        const tempArr: any[] = [];

        const arrarrNumberElement: any[] = [];
        const arrBodyData: string[][] = datasets.body;
        const arrHeaderData: string[] = datasets.header;
        const maxLength = this.GetDataMaxLength(arrBodyData);

        for (let i = 1; i <= maxLength; i++) {
            arrarrNumberElement.push(
                <div key={`body-number-${i}`} className="row-body">
                    <span className="text-center">{i}.</span>
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
                        SearchClickHandler: (column: string, label: string, value: string, masking?: string) => this.SearchClickHandler(column, label, value, masking),
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
            ReactDOM.render(<Toolbar {...this.state} ClearFilter={() => this.ClearFilter()} />, breadCrumbRight);
        }
    }

    NewChildren() {
        if (this.state.arrCloneChildren && this.state.arrCloneChildren.length > 0) {
            return this.state.arrCloneChildren;
        } else {
            return this.props.children;
        }
    }

    SearchData() {
        const arrBadges = [];
        if (this.state.arrSearchData && this.state.arrSearchData.length) {
            for (let i = 0; i < this.state.arrSearchData.length; i++) {
                const element: { [key: string]: string } = this.state.arrSearchData[i];
                let value = element.value;

                if (element.maskingValue !== undefined) {
                    value = element.maskingValue;
                }

                arrBadges.push(
                    <Badge key={`badge-${element.label}-${i}`} variant="primary" className="shadow-sm pointer">
                        <span className="label">
                            {element.label}: {value}
                        </span>
                        <i className="fas fa-times" onClick={() => this.RemoveSearchClickHandler(i)}></i>
                    </Badge>,
                );
            }
        }

        return arrBadges;
    }

    /* add attribute have-table=true, to tell css that scroll will have css top styling: 55px */
    setBodyAttribute(isAdd: boolean) {
        if (isAdd) {
            document.body.setAttribute('have-table', 'true');
        } else {
            document.body.removeAttribute('have-table');
        }
    }

    componentDidMount() {
        // console.log('mounted');
        this._isMounted = true;
        this.FetchTableData(true);
        this.AddToolBarDOM();
        this.setBodyAttribute(true);
    }

    componentWillUnmount() {
        this._isMounted = false;
        this.setBodyAttribute(false);
    }

    render() {
        return (
            <React.Fragment>
                <div
                    className={`table ${this.props.className ? `table-${this.props.className}` : ''} loading`.trim()}
                    id={`table ${this.props.id ? `table-${this.props.id}` : ''}`.trim()}
                    ref={this._Table}
                >
                    <div className="column-group">
                        <div className="row-header number">
                            <span className="text-center">#</span>
                        </div>
                        {this.state.arrNumberElement}
                    </div>
                    {this.NewChildren()}
                </div>

                {this.state.arrSearchData && this.state.arrSearchData.length > 0 && <div className="table-search-data">{this.SearchData()}</div>}
            </React.Fragment>
        );
    }
}

export default Table;
