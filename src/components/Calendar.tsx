import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import { DropdownButton, Dropdown } from 'react-bootstrap';

type DatePropsType = {
    weekIndex: number;
    dayIndex: number;
    currentYear: number;
    currentMonth: number;
    currentDay: number;
};

const DateComponent = (props: DatePropsType) => {
    let dateClassName = '';

    const currentDate = moment(new Date(props.currentYear, props.currentMonth, props.currentDay));
    // const currentDateDayFormat = currentDate.format('D').toString();
    const currentDateMonthFormat = currentDate.format('MM').toString();
    const currentDateYearFormat = currentDate.format('YYYY').toString();

    const calendarDate = moment().week(props.weekIndex).day(props.dayIndex);
    const calendarDateDayFormat = calendarDate.format('D').toString();
    const calendarDateMonthFormat = calendarDate.format('MM').toString();
    const calendarDateYearFormat = calendarDate.format('YYYY').toString();

    if (calendarDate.format('DDMMYYYY').toString() === currentDate.format('DDMMYYYY').toString()) {
        dateClassName = 'active';
    }

    if (currentDateMonthFormat !== calendarDateMonthFormat || currentDateYearFormat !== calendarDateYearFormat) {
        dateClassName = 'inactive';
    }

    return (
        <div day-index={props.dayIndex} className={dateClassName}>
            <span>{calendarDateDayFormat}</span>
        </div>
    );
};

type ToolbarPropsType = {
    currentYear: number;
    currentMonth: number;
    currentDay: number;
};

const Toolbar = (props: ToolbarPropsType) => {
    const arrYear: number[] = [];
    const arrMonth: number[] = [];

    for (let i = 1960; i <= props.currentYear; i++) {
        arrYear.push(i);
    }

    for (let i = 0; i <= 11; i++) {
        arrMonth.push(i);
    }

    return (
        <React.Fragment>
            <i className="fas fa-angle-left calendar-caret"></i>
            <i className="fas fa-angle-right calendar-caret"></i>
            <DropdownButton title={moment().month(props.currentMonth).format('MMMM').toString()} className="calendar-toolbar">
                {arrMonth.map((monthIndex) => {
                    return (
                        <Dropdown.Item key={`select-month-${monthIndex}`} value={monthIndex}>
                            {moment().month(monthIndex).format('MMMM').toString()}
                        </Dropdown.Item>
                    );
                })}
            </DropdownButton>
            <DropdownButton title={moment().year(props.currentYear).format('YYYY').toString()} className="calendar-toolbar">
                {arrYear.map((yearIndex) => {
                    return (
                        <Dropdown.Item key={`select-year-${yearIndex}`} value={yearIndex}>
                            {moment().year(yearIndex).format('YYYY').toString()}
                        </Dropdown.Item>
                    );
                })}
            </DropdownButton>
        </React.Fragment>
    );
};

type CalendarPropsType = {
    /*  */
};

type CalendarStateType = {
    currentYear: number;
    currentMonth: number;
    currentDay: number;
};

class Calendar extends Component<CalendarPropsType, CalendarStateType> {
    state = {
        currentYear: moment().year(),
        currentMonth: moment().month(),
        currentDay: moment().date(),
    };

    TotalDays(): number[] {
        const arr: number[] = [];

        for (let i = 0; i < 7; i++) {
            arr.push(i);
        }

        return arr;
    }

    TotalWeeks(): number[] {
        const currentWeekIndex = moment(new Date(this.state.currentYear, this.state.currentMonth, 0)).week();
        const arr: number[] = [];

        for (let i = 0 + currentWeekIndex; i < 6 + currentWeekIndex; i++) {
            arr.push(i);
        }

        return arr;
    }

    AddToolBarDOM() {
        const breadCrumbRight = document.getElementById('bread-crumb-right');
        if (breadCrumbRight) {
            ReactDOM.render(<Toolbar {...this.state} />, breadCrumbRight);
        }
    }

    componentDidMount() {
        this.AddToolBarDOM();
    }

    render() {
        return (
            <div className="calendar-container">
                <div className="calendar-body">
                    <div className="calendar-day-row">
                        {this.TotalDays().map((dayIndex) => {
                            return (
                                <div key={`days-name-${dayIndex}`} day-index={dayIndex}>
                                    <span>{moment().day(dayIndex).format('dd').toString()}</span>
                                </div>
                            );
                        })}
                    </div>
                    {this.TotalWeeks().map((weekIndex) => {
                        return (
                            <div key={`week-num-${weekIndex}`} className="calendar-date-row" week-index={weekIndex}>
                                {this.TotalDays().map((dayIndex) => {
                                    return (
                                        <DateComponent
                                            key={`date-${dayIndex}`}
                                            weekIndex={weekIndex}
                                            dayIndex={dayIndex}
                                            currentYear={this.state.currentYear}
                                            currentMonth={this.state.currentMonth}
                                            currentDay={this.state.currentDay}
                                        />
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default Calendar;
