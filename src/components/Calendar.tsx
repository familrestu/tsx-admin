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

const Toolbar = (props: ToolbarPropsType & CalendarStateType) => {
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

    const ChangeMonth = (type: number) => {
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
            <i className="fas fa-angle-left calendar-caret" onClick={() => ChangeMonth(0)}></i>
            <i className="fas fa-angle-right calendar-caret" onClick={() => ChangeMonth(1)}></i>
            <DropdownButton title={moment().month(props.currentMonth).format('MMMM').toString()} className="calendar-toolbar">
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
            <FormControl
                type="text"
                className="calendar-toolbar"
                defaultValue={moment().year(props.currentYear).month(props.currentMonth).format('YYYY').toString()}
                onDoubleClick={() => toggleYearDisabled(false)}
                onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    OnKeyPressHandler(e, parseInt(e.currentTarget.value));
                }}
                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                    OnBlurHandler(parseInt(e.currentTarget.value));
                }}
                title="Double click to change year"
                id="calendar-toolbar-years"
                onChange={() => null}
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

    const calendarDate = moment().year(props.currentYear).month(props.currentMonth).week(props.weekIndex).day(props.dayIndex);
    const calendarDateDayFormat = calendarDate.format('D').toString();
    const calendarDateMonthFormat = calendarDate.format('MM').toString();
    const calendarDateYearFormat = calendarDate.format('YYYY').toString();

    if (calendarDate.format('DDMMYYYY').toString() === currentDate.format('DDMMYYYY').toString()) {
        dateAttr['data-active'] = true;
    }

    if (currentDateMonthFormat !== calendarDateMonthFormat || currentDateYearFormat !== calendarDateYearFormat) {
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
    type?: 'calendar' | 'datepicker';
};

type CalendarStateType = {
    currentYear: number;
    currentMonth: number;
    currentDay: number;
    calendarData: { [key: string]: string }[];
};

class Calendar extends Component<CalendarPropsType, CalendarStateType> {
    _isMounted = false;

    state = {
        currentYear: moment().year(),
        currentMonth: moment().month(),
        currentDay: moment().date(),
        calendarData: [],
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

    SetStateCallBack(year: number) {
        this.AddToolBarDOM();
        this.SetYearInputValue(this.MinimumYear(year));
        this.SetCalendarData();
    }

    RemoveAddedAttributes() {
        /* since react only re-render changing components, then everytime user change to year, remove all updated attributes if any */
        const findDate = document.querySelectorAll(`div[data-calendardate]`);
        const arrKeepAttr = ['day-index', 'data-active', 'data-not-currentmonth', 'data-calendardate'];

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
                () => this.SetStateCallBack(year),
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
                () => this.SetStateCallBack(year),
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
                () => this.SetStateCallBack(year),
            );
        }
    }

    SetYearInputValue(year: number) {
        const inputYears = document.getElementById('calendar-toolbar-years') as HTMLInputElement;
        if (inputYears !== null) {
            inputYears.defaultValue = year.toString();
            inputYears.value = year.toString();
        }
    }

    AddToolBarDOM() {
        const breadCrumbRight = document.getElementById('bread-crumb-right');
        if (breadCrumbRight) {
            ReactDOM.render(
                <Toolbar
                    {...this.state}
                    ChangeYearHandler={(year: number) => this.ChangeYearHandler(year)}
                    ChangeMonthHandler={(month: number, year: number) => this.ChangeMonthHandler(month, year)}
                    ChangeDayHandler={(day: number, month: number, year: number) => this.ChangeDayHandler(day, month, year)}
                />,
                breadCrumbRight,
            );
        }
    }

    SetBodyAttribute(isAdd: boolean) {
        if (isAdd) {
            document.body.setAttribute('have-calendar', 'true');
        } else {
            document.body.removeAttribute('have-calendar');
        }
    }

    GetCalendarData() {
        // axios.post()
        if (this._isMounted) {
            // const calendarData = ;
            const path = `${process.env.REACT_APP_API_PATH}/system/application/GetHoliday`;
            axios
                .post(path, null, { withCredentials: true })
                .then((res) => {
                    if (res && res.data) {
                        this.setState(
                            (prevState) => {
                                return { ...prevState, calendarData: [...res.data.holiday] };
                            },
                            () => this.SetCalendarData(),
                        );
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }

    SetCalendarData() {
        if (this.state.calendarData.length) {
            for (let i = 0; i < this.state.calendarData.length; i++) {
                const calData: { [key: string]: string } = this.state.calendarData[i];
                let tempData = '';
                // console.log(calData);
                if (calData.date.indexOf('YYYY') >= 0) {
                    tempData = calData.date.replaceAll('YYYY', '');
                    tempData = tempData.substring(0, tempData.length - 1);
                }

                const findDate = document.querySelector(`div[data-calendardate*='${tempData}']`) as HTMLDivElement;
                // console.log(findDate, tempData);

                if (findDate) {
                    findDate.setAttribute('data-holiday', 'true');
                    findDate.setAttribute('title', calData.name);
                }
            }

            const allDate = document.querySelectorAll('div[data-calendardate]');
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
        this.AddToolBarDOM();
        this.SetBodyAttribute(true);
        this.GetCalendarData();
    }

    componentWillUnmount() {
        this._isMounted = false;
        this.SetBodyAttribute(false);
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
            <div className="calendar-container">
                <div className="calendar-body">
                    <DaynamesRow />
                    <DatesRow />
                </div>
            </div>
        );
    }
}

export default Calendar;
