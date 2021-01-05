import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import { Button, FormControl } from 'react-bootstrap';
import axios from 'axios';

type ToolbarPropsType = {
    ChangeYearHandler: (year: number) => void;
    ChangeMonthHandler: (month: number, year: number) => void;
    ChangeDayHandler: (day: number, month: number, year: number) => void;
};

const Toolbar = (props: ToolbarPropsType & CalendarStateType) => {
    const arrMonth: number[] = [];

    for (let i = 0; i <= 11; i++) {
        arrMonth.push(i);
    }

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

    const OptYear = () => {
        const arrOptYear: React.DetailedHTMLProps<React.OptionHTMLAttributes<HTMLOptionElement>, HTMLOptionElement>[] = [];
        for (let i = parseInt(moment().year().toString()) + 5; i >= 1950; i--) {
            arrOptYear.push(
                <option value={i} key={`year-${i}`}>
                    {i}
                </option>,
            );
        }

        return arrOptYear;
    };

    return (
        <React.Fragment>
            <Button size="sm" onClick={() => props.ChangeDayHandler(moment().date(), moment().month() + 1, moment().year())}>
                Today
            </Button>
            <div className="calendar-select-month">
                <i className="fas fa-angle-left calendar-caret" onClick={(e: React.MouseEvent<HTMLElement>) => ChangeMonth(e, 0)}></i>
                <FormControl as="select" size="sm" onChange={(e) => props.ChangeMonthHandler(parseInt(e.currentTarget.value), props.currentYear)} value={props.currentMonth}>
                    {arrMonth.map((monthIndex) => {
                        return (
                            <option key={`select-month-${monthIndex}`} value={monthIndex}>
                                {moment().month(monthIndex).format('MMMM').toString()}
                            </option>
                        );
                    })}
                </FormControl>
                <i className="fas fa-angle-right calendar-caret" onClick={(e: React.MouseEvent<HTMLElement>) => ChangeMonth(e, 1)}></i>
            </div>
            {/* using very unique key here, so react will always re-render year input. not a big deal */}
            {/* <FormControl
                key={`${moment().format('HHmmss.SSS').toString()}-yearinput`}
                type="text"
                className="calendar-select-year"
                defaultValue={moment().year(props.currentYear).month(props.currentMonth).format('YYYY').toString()}
                onClick={(e: React.MouseEvent<HTMLInputElement>) => {
                    e.currentTarget.removeAttribute('readonly');
                    e.currentTarget.focus();
                }}
                onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    const year = parseInt(e.currentTarget.value);
                    if (e.key.toUpperCase() === 'ENTER') {
                        e.currentTarget.setAttribute('readonly', 'true');
                        props.ChangeYearHandler(year);
                    }
                }}
                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                    const year = parseInt(e.currentTarget.value);
                    e.currentTarget.setAttribute('readonly', 'true');
                    props.ChangeYearHandler(year);
                }}
                readOnly
            /> */}
            <FormControl as="select" onChange={(e) => props.ChangeYearHandler(parseInt(e.currentTarget.value))} value={props.currentYear} className="calendar-select-year">
                {OptYear()}
            </FormControl>
        </React.Fragment>
    );
};

type DateComponentPropsType = {
    weekIndex: number;
    dayIndex: number;
    currentYear: number;
    currentMonth: number;
    currentDay: number;
    calendarData: { [key: string]: string }[] | null;

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

    // const calendarDate = moment().year(props.currentYear).week(props.weekIndex).day(props.dayIndex);
    const calendarDate = moment().year(props.currentYear).month(props.currentMonth).date(1).week(props.weekIndex).day(props.dayIndex);

    // console.log(moment().year(props.currentYear).month(props.currentMonth).date(1).week(props.weekIndex).day(props.dayIndex));
    // console.log(calendarDate);
    // calendarDate.year(props.currentYear).week(props.weekIndex);

    const calendarDateDayFormat = calendarDate.format('D').toString();
    const calendarDateMonthFormat = calendarDate.format('MM').toString();
    const calendarDateYearFormat = calendarDate.format('YYYY').toString();

    if (calendarDate.format('DDMMYYYY').toString() === currentDate.format('DDMMYYYY').toString()) {
        dateAttr['data-active'] = true;
    }

    if (currentDateMonthFormat !== calendarDateMonthFormat || currentDateYearFormat !== calendarDateYearFormat) {
        // if (currentDate.format('MMYYYY') !== calendarDate.format('MMYYYYY')) {
        dateAttr['data-not-currentmonth'] = true;
    }

    return (
        <div
            day-index={props.dayIndex}
            {...dateAttr}
            data-calendardate={`${calendarDate.format('DD-MM-YYYY')}`}
            onClick={() => props.ChangeDayHandler(parseInt(calendarDateDayFormat), parseInt(calendarDateMonthFormat), parseInt(calendarDateYearFormat))}
        >
            <span>{calendarDateDayFormat}</span>
        </div>
    );
};

type CalendarPropsType = {
    ToolbarPosition?: string;
    DatePickerInputRef?: HTMLInputElement;
    // DatePickerIconRef?: HTMLButtonElement;

    setToggleDatePicker?: () => void;
};

type CalendarStateType = {
    currentYear: number;
    currentMonth: number;
    currentDay: number;
    calendarData: { [key: string]: string }[];
};

class Calendar extends Component<CalendarPropsType, CalendarStateType> {
    _isMounted = false;
    _DatepickerHeader: HTMLDivElement | null | undefined;
    _DatepickerContainer: HTMLDivElement | null | undefined;
    _ToolbarPosition = this.props.ToolbarPosition !== undefined && this.props.ToolbarPosition;

    state = {
        currentYear: moment().year(),
        currentMonth: moment().month(),
        currentDay: moment().date(),
        calendarData: [],
    };
    mouseEnterEvent: (() => void) | undefined;
    mouseLeaveEvent: (() => void) | undefined;

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
        this.SetcalendarData();
    }

    RemoveAddedAttributes() {
        /* since react only re-render changing components, then everytime user change to year, remove all updated attributes if any */
        const findDate = document.querySelectorAll(`div[data-calendardate]`);
        const arrKeepAttr = ['day-index', 'data-active', 'data-not-currentmonth', 'data-calendardate'];

        if (findDate) {
            for (let i = 0; i < findDate.length; i++) {
                const element = findDate[i];
                element.removeAttribute('title');
                for (let x = 0; x < element.attributes.length; x++) {
                    const attr = element.attributes[x];
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
            if (this.props.DatePickerInputRef) {
                this.props.DatePickerInputRef.focus();
                this.props.DatePickerInputRef.value = moment()
                    .year(this.MinimumYear(year))
                    .month(month - 1)
                    .date(day)
                    .format('DD/MM/yyyy')
                    .toString();

                if (this.props.setToggleDatePicker) {
                    this.props.setToggleDatePicker();
                }
            }

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
            DOMElement = this._DatepickerHeader;
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

    GetcalendarData() {
        if (this._isMounted) {
            const path = `${process.env.REACT_APP_API_PATH}/system/application/GetHoliday`;
            axios
                .post(path, null, { withCredentials: true })
                .then((res) => {
                    if (res && res.data) {
                        this.setState(
                            (prevState) => {
                                return { ...prevState, calendarData: [...res.data.holiday] };
                            },
                            () => this.SetcalendarData(),
                        );
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }

    SetcalendarData() {
        if (this.state.calendarData.length) {
            for (let i = 0; i < this.state.calendarData.length; i++) {
                const calData: { [key: string]: string } = this.state.calendarData[i];
                let tempData = '';
                if (calData.date.indexOf('YYYY') >= 0) {
                    tempData = calData.date.replaceAll('YYYY', '');
                    tempData = tempData.substring(0, tempData.length - 1);
                }

                const findDate = document.querySelectorAll(`div[data-calendardate*='${tempData}']`);

                if (findDate.length) {
                    for (let i = 0; i < findDate.length; i++) {
                        const element = findDate[i] as HTMLDivElement;
                        element.setAttribute('data-holiday', 'true');
                        element.setAttribute('title', calData.name);
                    }
                }
            }

            const allDate = document.querySelectorAll('div[data-calendardate]');
            for (let i = 0; i < allDate.length; i++) {
                const dateBox = allDate[i] as HTMLDivElement;
                dateBox.style.height = `${dateBox.offsetWidth}px`;
            }
        }
    }

    SetListener() {
        if (this._DatepickerContainer) {
            this._DatepickerContainer.addEventListener(
                'mouseenter',
                (this.mouseEnterEvent = () => {
                    // console.log(this._DatepickerContainer?.parentElement);
                    if (this._DatepickerContainer && this._DatepickerContainer.parentElement) {
                        const parent = this._DatepickerContainer.parentElement;
                        parent.setAttribute('keep-focus', '1');
                    }
                }),
            );

            this._DatepickerContainer.addEventListener(
                'mouseleave',
                (this.mouseLeaveEvent = () => {
                    // console.log('mouseleave');
                    if (this._DatepickerContainer && this._DatepickerContainer.parentElement) {
                        const parent = this._DatepickerContainer.parentElement;
                        parent.removeAttribute('keep-focus');
                    }
                }),
            );
        }
    }

    RemoveListener() {
        if (this._DatepickerContainer && this.mouseEnterEvent && this.mouseLeaveEvent) {
            this._DatepickerContainer.removeEventListener('mouseenter', this.mouseEnterEvent);
            this._DatepickerContainer.removeEventListener('mouseleave', this.mouseLeaveEvent);
        }
    }

    SetSelectedDate() {
        if (this.props.DatePickerInputRef) {
            if (this.props.DatePickerInputRef.value !== '') {
                const day = parseInt(this.props.DatePickerInputRef.value.substring(0, 2));
                const month = parseInt(this.props.DatePickerInputRef.value.substring(3, 5));
                const year = parseInt(this.props.DatePickerInputRef.value.substring(6, 10));

                this.setState(
                    (prevState) => {
                        return { ...prevState, currentDay: day, currentMonth: month - 1, currentYear: this.MinimumYear(year) };
                    },
                    () => this.SetStateCallBack(),
                );
            }
        }
    }

    componentDidMount() {
        this._isMounted = true;
        this.AddToolbarToDOM();
        this.GetcalendarData();
        this.SetSelectedDate();
        this.SetListener();
    }

    componentWillUnmount() {
        this._isMounted = false;
        this.RemoveListener();
    }

    render() {
        const DaynamesRow = () => {
            return (
                <div className="calendar-day-row">
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
                if (
                    moment().year(this.state.currentYear).month(this.state.currentMonth).date(1).week(weekIndex).startOf('week') <=
                    moment().year(this.state.currentYear).month(this.state.currentMonth).endOf('month')
                ) {
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
                                calendarData={this.state.calendarData}
                            />,
                        );
                    }

                    returnElement.push(
                        <React.Fragment key={`week-num-${weekIndex}`}>
                            <div className="calendar-date-row" week-index={weekIndex}>
                                {arrDay}
                            </div>
                        </React.Fragment>,
                    );
                }
            }

            return <React.Fragment>{returnElement}</React.Fragment>;
        };

        return (
            <div
                className="calendar-container"
                ref={(ref) => {
                    this._DatepickerContainer = ref;
                }}
            >
                <div
                    className="calendar-header"
                    id="calendar-header"
                    onDoubleClick={() => null}
                    ref={(ref) => {
                        this._DatepickerHeader = ref;
                    }}
                />
                <div className="calendar-body" onDoubleClick={() => null}>
                    <DaynamesRow />
                    <DatesRow />
                </div>
            </div>
        );
    }
}

export default Calendar;
