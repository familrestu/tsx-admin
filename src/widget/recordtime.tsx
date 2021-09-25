import React from 'react';
import moment from 'moment';
import Avatar from 'components/Avatar';
import { AppState } from 'redux/store';
import { useSelector } from 'react-redux';

const date = moment();
const dayIndex = date.day();
const today = date.format('dddd DD MMM, YYYY');

const shift: { [key: number]: { dayType: 'OFF' | 'WD' | 'PHWD'; shiftName: string; shiftStartTime: string; shiftEndTime: string } } = {
    0: {
        dayType: 'OFF',
        shiftName: 'Off Day',
        shiftStartTime: '00:00',
        shiftEndTime: '00:00',
    },
    1: {
        dayType: 'WD',
        shiftName: 'Regular Office Hour',
        shiftStartTime: '08:00',
        shiftEndTime: '17:00',
    },
    2: {
        dayType: 'WD',
        shiftName: 'Regular Office Hour',
        shiftStartTime: '08:00',
        shiftEndTime: '17:00',
    },
    3: {
        dayType: 'WD',
        shiftName: 'Regular Office Hour',
        shiftStartTime: '08:00',
        shiftEndTime: '17:00',
    },
    4: {
        dayType: 'WD',
        shiftName: 'Regular Office Hour',
        shiftStartTime: '08:00',
        shiftEndTime: '17:00',
    },
    5: {
        dayType: 'WD',
        shiftName: 'Regular Office Hour',
        shiftStartTime: '08:00',
        shiftEndTime: '17:00',
    },
    6: {
        dayType: 'OFF',
        shiftName: 'Off Day',
        shiftStartTime: '00:00',
        shiftEndTime: '00:00',
    },
};

const attendance: {
    shiftStartTime: null | string;
    shiftEndTime: null | string;
} = {
    shiftStartTime: null,
    shiftEndTime: null,
};

if (shift[dayIndex] !== undefined && shift[dayIndex].dayType !== 'OFF') {
    attendance.shiftStartTime = '07:45';
    attendance.shiftEndTime = '17:21';
}

const RecordTime = () => {
    const access = '/attendance/record-attendance';
    const UserState = useSelector((state: { UserState: AppState['UserState'] }) => state.UserState);
    const AccessState = useSelector((state: { AccessState: AppState['AccessState'] }) => state.AccessState);

    const haveAccess = AccessState.filter((a) => {
        return a.url === access;
    }).length
        ? true
        : false;

    if (haveAccess) {
        return (
            <div className="col-12 col-sm-4 col-md-4 col-lg-4 col-xl-4 col-auto" style={{ height: '100%' }}>
                <div className="card">
                    <div className="card-body">
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', marginRight: '1rem', alignItems: 'center' }}>
                                    <Avatar style={{ pointerEvents: 'none' }} />
                                </div>
                                <div>
                                    <div style={{ flex: 1, textTransform: 'capitalize' }}>
                                        <b>{UserState.displayname}</b>
                                    </div>
                                    <div style={{ flex: 1 }}>{today.toString()}</div>
                                    <div style={{ flex: 1 }}>
                                        {shift[dayIndex] !== undefined ? shift[dayIndex].shiftName : 'N/A'}
                                        {shift[dayIndex] !== undefined && shift[dayIndex].dayType !== 'OFF' ? ` | ${shift[dayIndex].shiftStartTime} - ${shift[dayIndex].shiftEndTime}` : ''}
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', flex: 1, justifyContent: 'center', fontSize: '2rem', borderRight: '1px solid #ffff', color: 'var(--success)' }}>
                                    {attendance.shiftStartTime !== null ? attendance.shiftStartTime : '--:--'}
                                </div>
                                <div style={{ display: 'flex', flex: 1, justifyContent: 'center', fontSize: '2rem', borderLeft: '1px solid #ffff', color: 'var(--danger)' }}>
                                    {attendance.shiftEndTime !== null ? attendance.shiftEndTime : '--:--'}
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <button className="btn btn-primary">Record Time</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        return <React.Fragment />;
    }
};

export default RecordTime;
