import React, { Component } from 'react';
import CSS from 'csstype';
import { Badge } from 'react-bootstrap';
import { AxiosError, AxiosResponse } from 'axios';
import { post } from 'libs/fetch';
import { PageCloneChildrenPropsType } from 'components/Page';
import { Toolbar, ExportToExcel, ExportToPDF, BtnPrintPreview } from 'components/Toolbar';

type TableDataType = {
    header: string[];
    body: string[][];
};

export type TablePropsType = {
    datasource?: string;
    className?: string;
    id?: string;

    height?: CSS.Properties['height'];
    width?: CSS.Properties['width'];
    onSubmitSuccessCallBack?: (res: any) => void;
    onSubmitErrorCallBack?: () => void;
    children?: React.ReactChild[] | React.ReactChild | Element | Element[];
};

export type TableStateType = {
    arrTableData?: TableDataType;
    arrCloneChildren?: React.ReactElement[];
    arrNumberElement?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>[];
    arrSortColumn?: string[];
    arrSortType?: string[];
    arrSearchData?: { [key: string]: string }[];
};

class Table extends Component<TablePropsType & PageCloneChildrenPropsType, TableStateType> {
    _isMounted = false;
    _Table: HTMLDivElement | null | undefined;

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
            if (remove) {
                this._Table.classList.remove('loading');
            } else {
                this._Table.classList.add('loading');
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
                path = `${this.props.datasource}/TableData`;
            } else {
                path = `${this.props.datasource}`;
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

            const onSuccessPost = (res: AxiosResponse) => {
                if (res) {
                    if (res.data && res.data.datasets) {
                        const { datasets } = res.data;
                        this.CloneChildren(datasets);
                        this.SetLoadingRow(true);
                        // this.AddToolBarDOM();
                    }

                    if (this.props.onSubmitSuccessCallBack) {
                        this.props.onSubmitSuccessCallBack(res);
                    }
                }
            };

            const onErrorPost = (err: AxiosError) => {
                if (this.props.onSubmitErrorCallBack) {
                    this.props.onSubmitErrorCallBack();
                }
                console.error(err);
                this.CloneChildren({ header: [], body: [] });
                this.SetLoadingRow(true);
            };

            post(
                {
                    arrSortColumn: this.state.arrSortColumn,
                    arrSortType: this.state.arrSortType,
                    arrSearchData: this.state.arrSearchData,
                },
                path,
                null,
                (res: AxiosResponse) => onSuccessPost(res),
                (err: AxiosError) => onErrorPost(err),
            );
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
        const tempArr: React.ReactElement[] = [];

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
            const tempChild: any = child;
            // console.log(tempChild);
            if (React.isValidElement(child) && tempChild.type.displayName !== undefined && tempChild.type.displayName === 'Column') {
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

    ToolbarChildren() {
        const tempArr: React.ReactElement[] = [];
        React.Children.map(this.props.children, (child, index) => {
            const tempChild: any = child;

            if (React.isValidElement(child) && tempChild.type.displayName !== undefined && tempChild.type.displayName === 'Toolbar') {
                tempArr.push(React.cloneElement(child, { key: `child-cloned-toolbar-${index}`, tableState: this.state, datasource: this.props.datasource }));
            }
        });

        return (
            <Toolbar {...this.state} datasource={this.props.datasource} ClearFilter={() => this.ClearFilter()}>
                {tempArr}
            </Toolbar>
        );
    }

    componentDidMount() {
        this._isMounted = true;
        this.FetchTableData(true);
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        return (
            <React.Fragment>
                <div id="toolbar-container" className="toolbar-container">
                    <div className="toolbar-left">
                        <div className="toolbar-wrapper" id="toolbar-wrapper">
                            {this.ToolbarChildren()}
                        </div>
                    </div>
                    <div className="toolbar-right">
                        <div className="toolbar-wrapper" id="toolbar-wrapper">
                            {/* {this.ToolbarChildren()} */}
                            <ExportToExcel {...this.state} />
                            <ExportToPDF {...this.state} />
                            <BtnPrintPreview {...this.state} />
                        </div>
                    </div>
                </div>
                <div
                    className={`table ${this.props.className ? `table-${this.props.className}` : ''} loading`.trim()}
                    id={`table ${this.props.id ? `table-${this.props.id}` : ''}`.trim()}
                    ref={(ref) => {
                        this._Table = ref;
                    }}
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
