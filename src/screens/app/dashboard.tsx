import React from 'react';
import Page from 'components/Page';
import { useSelector } from 'react-redux';
import { AppState } from 'redux/store';
import { ReactComponent as HomeSVG1 } from 'assets/svg/home.svg';
import moment from 'moment';

const Greetings = () => {
    const UserState = useSelector((state: AppState) => state.UserState);
    return (
        <div className="row">
            <div className="col col-12 col-md-6 mb-4">
                <div className="card greetings shadow-sm">
                    <div className="card-body">
                        <div className="svg-container">
                            <HomeSVG1 />
                        </div>
                        <p className="bold">Hello, {UserState.full_name}</p>
                        <p>Welcome aboard! We are proud to you with us. We all have have faith that you’ll deliver results, excel and make us all proud.</p>
                    </div>
                </div>
            </div>

            <div className="col col-12 col-md-4 col-lg-4 col-xl-3 mb-4">
                <div className="card time shadow-sm">
                    <div className="card-body">
                        <div className="card-header">
                            <span className="text-secondary bold">{moment().format('dddd DD MMM, YYYY').toString()}</span> <br />
                            <span className="text-secondary" style={{ fontSize: '.9rem' }}>
                                Shift: Office Hours | 08:00 - 17:00
                            </span>
                        </div>
                        <div className="card-content">
                            <div className="timestamp-container">
                                <div className="timestamp text-secondary">--:--</div>
                                <div className="timestamp text-danger">--:--</div>
                            </div>
                        </div>
                        <div className="card-footer">
                            <div className="btn-container">
                                <button className="btn btn-secondary">Record Time</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Recordtime = () => {
    return <div className="row"></div>;
};

class Home extends React.Component {
    render() {
        return (
            <Page breadCrumb="Dashboard">
                <Greetings />
                <Recordtime />
            </Page>
        );
    }
}

export default Home;
