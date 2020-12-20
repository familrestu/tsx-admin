import React, { Component, useState } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import { Button, DropdownButton, Dropdown, FormControl } from 'react-bootstrap';
import axios from 'axios';

type ToolbarPropsType = {
    ChangeYearHandler: (year: number) => void;
    ChangeMonthHandler: (month: number, year: number) => void;
    ChangeDayHandler: (day: number, month: number, year: number) => void;
};

const Toolbar = (props: ToolbarPropsType & DatepickerStateType) => {
    const arrMonth: number[] = [];
    const [isYearDisabled, toggleYearDisabled] = useState(true);

    for (let i = 0; i <= 11; i++) {
        arrMonth.push(i);
    }

    const OnKeyPressHandler = (e: React.KeyboardEvent<HTMLInputElement>, year: number) => {
        if (e.key.toUpperCase() === 'ENTER') {
            toggleYearDisabled(true);
            props.ChangeYearHandler(year);
        }
    };

    const OnBlurHandler = (year: number) => {
        toggleYearDisabled(true);
        props.ChangeYearHandler(year);
    };

    const ChangeMonth = (e: React.MouseEvent<HTMLElement>, type: number) => {
        let month = 0;
        let year = 0;

        if (type === 0) {
            if (props.currentMonth - 1 < 0) {
                month = 11;
                year = props.currentYear - 1;
            } else {
                month = props.currentMonth - 1;
                year = props.currentYear;
            }
        } else if (type === 1) {
            if (props.currentMonth + 1 > 11) {
                month = 0;
                year = props.currentYear + 1;
            } else {
                month = props.currentMonth + 1;
                year = props.currentYear;
            }
        }

        props.ChangeMonthHandler(month, year);
    };

    return (
        <React.Fragment>
            <Button size="sm" onClick={() => props.ChangeDayHandler(moment().date(), moment().month() + 1, moment().year())}>
                Today
            </Button>
            <i className="fas fa-angle-left datepicker-caret" onClick={(e: React.MouseEvent<HTMLElement>) => ChangeMonth(e, 0)}></i>

            <DropdownButton title={moment().month(props.currentMonth).format('MMMM').toString()} className="datepicker-toolbar btn-group-sm">
                {arrMonth.map((monthIndex) => {
                    return (
                        <Dropdown.Item
                            key={`select-month-${monthIndex}`}
                            className={props.currentMonth === monthIndex ? 'active' : ''}
                            value={monthIndex}
                            onClick={() => props.ChangeMonthHandler(monthIndex, props.currentYear)}
                        >
                            {moment().month(monthIndex).format('MMMM').toString()}
                        </Dropdown.Item>
                    );
                })}
            </DropdownButton>
            <i className="fas fa-angle-right datepicker-caret" onClick={(e: React.MouseEvent<HTMLElement>) => ChangeMonth(e, 1)}></i>
            <FormControl
                /* using very unique key here, so react will always re-render year input. not a big deal */
                key={`${moment().format('HHmmss.SSS').toString()}-yearinput`}
                type="text"
                className="datepicker-toolbar datepicker-toolbar-year-input"
                defaultValue={moment().year(props.currentYear).month(props.currentMonth).format('YYYY').toString()}
                onDoubleClick={() => toggleYearDisabled(false)}
                onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    OnKeyPressHandler(e, parseInt(e.currentTarget.value));
                }}
                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                    OnBlurHandler(parseInt(e.currentTarget.value));
                }}
                title="Double click to change year"
                // onChange={() => null}
                readOnly={isYearDisabled}
            />
        </React.Fragment>
    );
};

type DateComponentPropsType = {
    weekIndex: number;
    dayIndex: number;
    currentYear: number;
    currentMonth: number;
    currentDay: number;
    datepickerData: { [key: string]: string }[] | null;

    ChangeDayHandler: (day: number, month: number, year: number) => void;
};

type DateAttributesType = {
    'data-active'?: boolean;
    'data-not-currentmonth'?: boolean;
};

const DateComponent = (props: DateComponentPropsType) => {
    const dateAttr: DateAttributesType = {};
    const currentDate = moment().year(props.currentYear).month(props.currentMonth).date(props.currentDay);
    // const currentDateDayFormat = currentDate.format('D').toString();
    const currentDateMonthFormat = currentDate.format('MM').toString();
    const currentDateYearFormat = currentDate.format('YYYY').toString();

    const datepickerDate = moment().year(props.currentYear).month(props.currentMonth).week(props.weekIndex).day(props.dayIndex);
    const datepickerDateDayFormat = datepickerDate.format('D').toString();
    const datepickerDateMonthFormat = datepickerDate.format('MM').toString();
    const datepickerDateYearFormat = datepickerDate.format('YYYY').toString();

    if (datepickerDate.format('DDMMYYYY').toString() === currentDate.format('DDMMYYYY').toString()) {
        dateAttr['data-active'] = true;
    }

    if (currentDateMonthFormat !== datepickerDateMonthFormat || currentDateYearFormat !== datepickerDateYearFormat) {
        dateAttr['data-not-currentmonth'] = true;
    }

    return (
        <div
            day-index={props.dayIndex}
            {...dateAttr}
            data-datepickerdate={`${datepickerDate.format('DD-MM-YYYY')}`}
            onClick={() => props.ChangeDayHandler(parseInt(datepickerDateDayFormat), parseInt(datepickerDateMonthFormat), parseInt(datepickerDateYearFormat))}
        >
            <span>{datepickerDateDayFormat}</span>
        </div>
    );
};

type DatepickerPropsType = {
    type?: 'datepicker' | 'datepicker-range';
    ToolbarPosition?: string;
};

type DatepickerStateType = {
    currentYear: number;
    currentMonth: number;
    currentDay: number;
    datepickerData: { [key: string]: string }[];
};

class DatePicker extends Component<DatepickerPropsType, DatepickerStateType> {
    _isMounted = false;
    _Type = this.props.type === undefined ? 'datepicker' : this.props.type;
    _DatePickerHeader: HTMLDivElement | null | undefined;
    _ToolbarPosition = this.props.ToolbarPosition !== undefined && this.props.ToolbarPosition;

    state = {
        currentYear: moment().year(),
        currentMonth: moment().month(),
        currentDay: moment().date(),
        datepickerData: [],
    };

    TotalDays(): number[] {
        const arr: number[] = [];

        for (let i = 0; i < 7; i++) {
            arr.push(i);
        }

        return arr;
    }

    TotalWeeks(): number[] {
        const date = moment().year(this.state.currentYear).month(this.state.currentMonth).date(1);
        const currentWeekIndex = date.week();
        const arr: number[] = [];

        for (let i = 0 + currentWeekIndex; i < 6 + currentWeekIndex; i++) {
            arr.push(i);
        }

        return arr;
    }

    MinimumYear(year: number): number {
        return Math.max(1900, year);
    }

    SetStateCallBack() {
        this.AddToolbarToDOM();
        this.SetdatepickerData();
    }

    RemoveAddedAttributes() {
        /* since react only re-render changing components, then everytime user change to year, remove all updated attributes if any */
        const findDate = document.querySelectorAll(`div[data-datepickerdate]`);
        const arrKeepAttr = ['day-index', 'data-active', 'data-not-currentmonth', 'data-datepickerdate'];

        if (findDate) {
            for (let i = 0; i < findDate.length; i++) {
                const element = findDate[i];
                // console.log(element.attributes);
                element.removeAttribute('title');
                for (let x = 0; x < element.attributes.length; x++) {
                    const attr = element.attributes[x];
                    // console.log(attr);
                    if (arrKeepAttr.indexOf(attr.nodeName) < 0) {
                        element.removeAttribute(attr.nodeName);
                    }
                }
            }
        }
    }

    ChangeYearHandler(year: number) {
        if (this.state.currentYear !== year) {
            this.RemoveAddedAttributes();
            this.setState(
                (prevState) => {
                    return { ...prevState, currentYear: this.MinimumYear(year) };
                },
                () => this.SetStateCallBack(),
            );
        }
    }

    ChangeMonthHandler(month: number, year: number) {
        if (this.state.currentMonth !== month || this.state.currentYear !== year) {
            this.RemoveAddedAttributes();
            this.setState(
                (prevState) => {
                    return { ...prevState, currentMonth: month, currentYear: this.MinimumYear(year) };
                },
                () => this.SetStateCallBack(),
            );
        }
    }

    ChangeDayHandler(day: number, month: number, year: number) {
        if (this.state.currentDay !== day || this.state.currentMonth !== month || this.state.currentYear !== year) {
            this.RemoveAddedAttributes();
            this.setState(
                (prevState) => {
                    return { ...prevState, currentDay: day, currentMonth: month - 1, currentYear: this.MinimumYear(year) };
                },
                () => this.SetStateCallBack(),
            );
        }
    }

    AddToolbarToDOM() {
        let DOMElement;
        if (this._ToolbarPosition) {
            DOMElement = document.getElementById(this._ToolbarPosition);
        } else {
            DOMElement = this._DatePickerHeader;
        }

        if (DOMElement) {
            ReactDOM.render(
                <Toolbar
                    {...this.state}
                    ChangeYearHandler={(year: number) => this.ChangeYearHandler(year)}
                    ChangeMonthHandler={(month: number, year: number) => this.ChangeMonthHandler(month, year)}
                    ChangeDayHandler={(day: number, month: number, year: number) => this.ChangeDayHandler(day, month, year)}
                />,
                DOMElement,
            );
        }
    }

    GetdatepickerData() {
        // axios.post()
        if (this._isMounted) {
            // const datepickerData = ;
            const path = `${process.env.REACT_APP_API_PATH}/system/application/GetHoliday`;
            axios
                .post(path, null, { withCredentials: true })
                .then((res) => {
                    if (res && res.data) {
                        this.setState(
                            (prevState) => {
                                return { ...prevState, datepickerData: [...res.data.holiday] };
                            },
                            () => this.SetdatepickerData(),
                        );
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }

    SetdatepickerData() {
        if (this.state.datepickerData.length) {
            for (let i = 0; i < this.state.datepickerData.length; i++) {
                const calData: { [key: string]: string } = this.state.datepickerData[i];
                let tempData = '';
                // console.log(calData);
                if (calData.date.indexOf('YYYY') >= 0) {
                    tempData = calData.date.replaceAll('YYYY', '');
                    tempData = tempData.substring(0, tempData.length - 1);
                }

                const findDate = document.querySelectorAll(`div[data-datepickerdate*='${tempData}']`);
                // console.log(findDate, tempData);

                if (findDate.length) {
                    for (let i = 0; i < findDate.length; i++) {
                        const element = findDate[i] as HTMLDivElement;
                        element.setAttribute('data-holiday', 'true');
                        element.setAttribute('title', calData.name);
                    }
                }
            }

            const allDate = document.querySelectorAll('div[data-datepickerdate]');
            // console.log(allDate);
            for (let i = 0; i < allDate.length; i++) {
                const dateBox = allDate[i] as HTMLDivElement;
                // console.log();
                dateBox.style.height = `${dateBox.offsetWidth}px`;
            }
        }
    }

    componentDidMount() {
        this._isMounted = true;
        this.AddToolbarToDOM();
        this.GetdatepickerData();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        const DaynamesRow = () => {
            return (
                <div className="datepicker-day-row">
                    {this.TotalDays().map((dayIndex) => {
                        return (
                            <div key={`days-name-${dayIndex}`} day-index={dayIndex}>
                                <span>{moment().day(dayIndex).format('dd').toString()}</span>
                            </div>
                        );
                    })}
                </div>
            );
        };

        const DatesRow = () => {
            const returnElement: JSX.Element[] = [];

            const totalWeeks = this.TotalWeeks();
            const totalDays = this.TotalDays();

            for (let i = 0; i < totalWeeks.length; i++) {
                const weekIndex = totalWeeks[i];
                const startOfWeek = moment().year(this.state.currentYear).month(this.state.currentMonth).week(weekIndex).startOf('week');
                const endOfWeek = moment().year(this.state.currentYear).month(this.state.currentMonth).week(weekIndex).endOf('week');
                const endOfMonth = moment().year(this.state.currentYear).month(this.state.currentMonth).endOf('month');

                if (startOfWeek <= endOfMonth || endOfWeek <= endOfMonth) {
                    const arrDay: JSX.Element[] = [];

                    for (let x = 0; x < totalDays.length; x++) {
                        const dayIndex = totalDays[x];
                        arrDay.push(
                            <DateComponent
                                key={`date-${dayIndex}`}
                                weekIndex={weekIndex}
                                dayIndex={dayIndex}
                                currentYear={this.state.currentYear}
                                currentMonth={this.state.currentMonth}
                                currentDay={this.state.currentDay}
                                ChangeDayHandler={(day: number, month: number, year: number) => this.ChangeDayHandler(day, month, year)}
                                datepickerData={this.state.datepickerData}
                            />,
                        );
                    }

                    returnElement.push(
                        <React.Fragment key={`week-num-${weekIndex}`}>
                            <div className="datepicker-date-row" week-index={weekIndex}>
                                {arrDay}
                            </div>
                        </React.Fragment>,
                    );
                }
            }

            return <React.Fragment>{returnElement}</React.Fragment>;
        };

        return (
            <div className="datepicker-container">
                <div className="datepicker-header" id="datepicker-header" ref={(ref) => (this._DatePickerHeader = ref)} />
                <div className="datepicker-body">
                    <DaynamesRow />
                    <DatesRow />
                </div>
            </div>
        );
    }
}

export default DatePicker;
