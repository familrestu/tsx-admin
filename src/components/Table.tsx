import React, { Component } from 'react';
import CSS from 'csstype';
import { Badge } from 'react-bootstrap';
import { AxiosResponse } from 'axios';
import { post } from 'libs/fetch';
import { Toolbar, ExportToExcel, ExportToPDF, BtnPrintPreview } from 'components/Toolbar';
import { connect } from 'react-redux';
import { AppState } from 'redux/store';

type TableDataType = {
    header: string[];
    body: string[][];
    totalData: number;
    currentPage: number;
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
    totalTableData?: number;
    currentPage?: number;
};

class Table extends Component<TablePropsType & MapStateToPropsType & typeof MapDispatch, TableStateType> {
    _isMounted = false;
    _ScrollFetch = false;
    _ScrolLFetchTimeout: number | undefined;
    _Table: HTMLDivElement | null | undefined;

    state: TableStateType = {
        arrTableData: {
            header: [],
            body: [],
            totalData: 0,
            currentPage: 0,
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
        this._ScrollFetch = true;
        if (this.props.datasource && this.state.arrTableData) {
            const path: string = this.props.datasource;
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

            const onSuccessPost = (res: any) => {
                if (res) {
                    if (res.data && res.data.datasets) {
                        const { datasets } = res.data;
                        this.CloneChildren(datasets);
                        this.SetLoadingRow(true);
                        this._ScrollFetch = false;
                    }

                    if (this.props.onSubmitSuccessCallBack) {
                        this.props.onSubmitSuccessCallBack(res);
                    }
                }
            };

            const onErrorPost = () => {
                if (this.props.onSubmitErrorCallBack) {
                    this.props.onSubmitErrorCallBack();
                }
                const emptyData: TableDataType = { header: [], body: [], totalData: 0, currentPage: 0 };
                this.CloneChildren(emptyData);
                this.SetLoadingRow(true);
                this._ScrollFetch = false;

                if (this.props.TriggerState.eventName === 'FetchTable') {
                    this.props.CLEARTRIGGER();
                }
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
                () => onErrorPost(),
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

        const arrNumber = [];

        for (let i = 1; i <= maxLength; i++) {
            arrarrNumberElement.push(
                <div key={`body-number-${i}`} className="row-body">
                    <span className="text-center">{i}.</span>
                </div>,
            );
            arrNumber.push(i);
        }

        React.Children.map(this.props.children, (child, index) => {
            const tempChild: any = child;
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
                        totalData: datasets.totalData,
                        currentPage: datasets.currentPage,
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

    SetNumbering() {
        return (
            <React.Fragment>
                <div className="column-group">
                    <div className="row-header number">
                        <span className="text-center">#</span>
                    </div>
                    {this.state.arrNumberElement && this.state.arrNumberElement.length > 0
                        ? this.state.arrNumberElement
                        : this.state.arrTableData &&
                          this.state.arrTableData.header.length === 0 &&
                          [1, 2, 3, 4, 5].map((i: number) => {
                              return (
                                  <div key={`unknown-key-${i}`} className="row-body">
                                      <span>&nbsp;</span>
                                  </div>
                              );
                          })}
                </div>
            </React.Fragment>
        );
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
                    <Badge key={`badge-${element.label}-${i}`} className="shadow-sm pointer">
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

    ToolbarChildren(position?: 'left' | 'right') {
        const tempArr: React.ReactElement[] = [];
        React.Children.map(this.props.children, (child, index) => {
            const tempChild: any = child;

            if (React.isValidElement(child) && tempChild.type.displayName !== undefined && tempChild.type.displayName === 'Toolbar') {
                // console.log(child);
                tempArr.push(
                    React.cloneElement(child, {
                        key: `child-cloned-toolbar-${index}`,
                        tableState: this.state,
                        datasource: this.props.datasource,
                        toolbarPosition: position === undefined ? 'right' : position,
                    }),
                );
            }
        });

        return (
            <Toolbar {...this.state} datasource={this.props.datasource} toolbarPosition={position}>
                {tempArr}
            </Toolbar>
        );
    }

    TableScrollEvent() {
        window.clearTimeout(this._ScrolLFetchTimeout);
        if (this._Table && this._Table.parentElement) {
            const { scrollHeight, scrollTop, clientHeight } = this._Table.parentElement;
            this._ScrolLFetchTimeout = window.setTimeout(() => {
                if (clientHeight + scrollTop >= scrollHeight * (70 / 100)) {
                    if (!this._ScrollFetch) {
                        this.FetchTableData(false);
                    }
                }
            }, 300);
        }
    }

    SetListenerToBodyContent() {
        if (this._Table && this._Table.parentElement) {
            this._Table.parentElement.addEventListener('scroll', () => this.TableScrollEvent(), true);
        }
    }

    RemoveListenerFromBodyContent() {
        if (this._Table && this._Table.parentElement) {
            this._Table.parentElement.removeEventListener('scroll', () => this.TableScrollEvent(), true);
        }
    }

    componentDidMount() {
        this._isMounted = true;
        this.FetchTableData(true);
        this.SetListenerToBodyContent();
    }

    componentDidUpdate() {
        if (this.props.TriggerState.eventName === 'FetchTable') {
            this.FetchTableData(false);
            this.props.CLEARTRIGGER();
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
        this.RemoveListenerFromBodyContent();
    }

    render() {
        return (
            <React.Fragment>
                <div id="toolbar-container" className="toolbar-container">
                    <div className="toolbar-left">
                        <div className="toolbar-wrapper" id="toolbar-wrapper">
                            {this.ToolbarChildren('left')}
                        </div>
                    </div>
                    <div className="toolbar-right">
                        <div className="toolbar-wrapper" id="toolbar-wrapper">
                            {this.state.arrSearchData && this.state.arrSearchData.length > 0 && (
                                <button
                                    title="Clear Filter"
                                    className="btn btn-primary position-relative"
                                    onClick={() => {
                                        if (this.ClearFilter) {
                                            this.ClearFilter();
                                        }
                                    }}
                                >
                                    <i className="fas fa-filter"></i>
                                    <i className="fas fa-times-circle position-absolute" style={{ right: '.25rem', bottom: '.25rem', fontSize: '.75rem' }}></i>
                                </button>
                            )}
                            {this.ToolbarChildren('right')}
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
                    {this.SetNumbering()}
                    {this.NewChildren()}
                </div>
                {this.state.arrSearchData && this.state.arrSearchData.length > 0 && <div className="table-search-data">{this.SearchData()}</div>}
            </React.Fragment>
        );
    }
}

type MapStateToPropsType = {
    TriggerState: AppState['TriggerState'];
};

const MapStateToProps = (state: MapStateToPropsType) => ({
    TriggerState: state.TriggerState,
});

const MapDispatch = {
    CLEARTRIGGER: () => ({ type: 'CLEARTRIGGER' }),
};

export default connect(MapStateToProps, MapDispatch)(Table);
