import React, { Component } from 'react';
import { Badge } from 'react-bootstrap';
import Simplebar from 'simplebar-react';
import Icon from 'components/Icon';
import { ReactComponent as NotificationSVG } from 'assets/svg/notification.svg';

type NotificationDataType = {
    type: string;
    icon: string;
    date: string;
    title: string;
    details: any;
}[];

type NotificationPropsType = {
    isMobile: boolean;
};

type NotificationStateType = {
    // counter: number;
    data: NotificationDataType;
};

class Notification extends Component<NotificationPropsType, NotificationStateType> {
    state = {
        // counter: 0,
        data: [
            /*  {
                type: 'request',
                icon: 'fas fa-day',
                date: '12-Dec-2020',
                title: 'Leave Request',
                details: {},
            }, */
        ],
    };

    ShowDetailHandler(element: React.MouseEvent) {
        const currentTarget = element.currentTarget as HTMLDivElement;
        if (currentTarget.lastChild !== null) {
            (currentTarget.lastChild as HTMLDivElement).classList.toggle('showdetails');

            const detailsElement = (currentTarget.lastChild as HTMLDivElement).children[1].children[1] as HTMLDivElement;

            if (detailsElement !== null) {
                const expandedHeight = detailsElement.getAttribute('expanded-height');

                if ((currentTarget.lastChild as HTMLDivElement).classList.value.indexOf('showdetails') > 0) {
                    detailsElement.style.height = `${expandedHeight}px`;
                } else {
                    detailsElement.style.height = '0px';
                }
            }
        }
    }

    /* this for details height */
    HideShowedNotificationDetailsHandler() {
        const arrShowedDetails = document.querySelectorAll('.notification-items-container .showdetails');

        for (let i = 0; i < arrShowedDetails.length; i++) {
            const element = arrShowedDetails[i];
            (element as HTMLDivElement).classList.remove('showdetails');
        }

        const arrDetails = document.querySelectorAll('.notification-items-container .details');

        for (let i = 0; i < arrDetails.length; i++) {
            const element = arrDetails[i];
            (element as HTMLDivElement).style.height = '0px';
        }

        const notifContainer = document.getElementById('notification-list');
        if (notifContainer !== null) {
            notifContainer.removeAttribute('style');
            notifContainer.classList.remove('show');
        }
    }

    componentDidMount() {
        this.HideShowedNotificationDetailsHandler();
    }

    componentDidUpdate() {
        this.HideShowedNotificationDetailsHandler();
    }

    render() {
        const NotificationItem = () => {
            return (
                <div className="dropdown-item notification-item" onClick={(e: React.MouseEvent) => this.ShowDetailHandler(e)}>
                    <div className="notification-icon">
                        <i className="fas fa-calendar-day"></i>
                    </div>
                    <div className="notification-content showdetails">
                        <div className="notification-title">
                            <span>26 Sept, 2020</span>
                            <i className="fas fa-chevron-left"></i>
                        </div>
                        <div className="notification-body">
                            <div className="preview">Leave Request for Famil Restu Pambudi</div>
                            <div
                                className="details"
                                ref={(ref) => {
                                    if (ref !== null) {
                                        ref.setAttribute('expanded-height', ref.offsetHeight.toString());
                                    }
                                }}
                            >
                                <div>Request Date: 2 Oct, 2020 - 2 Oct, 2020</div>
                                <div>Leave Balance: 12</div>
                                <hr />
                                <div className="approver bold">
                                    Approval 1
                                    <br />
                                    Approval 2
                                    <br />
                                    Approval 3
                                </div>
                            </div>
                        </div>
                        <div className="notification-footer">
                            <span className="text-right">Unverified</span>
                        </div>
                    </div>
                </div>
            );
        };

        return (
            <div id="notification" className="notification icon-groups mx-2 pointer btn-open-dropdown" tabIndex={0} /* add tabIndex for adding focus */>
                {this.state.data.length > 0 && (
                    <Badge className="position-absolute badge-counter" variant="danger">
                        {this.state.data.length > 99 ? '99+' : this.state.data.length}
                    </Badge>
                )}
                <Icon name="fas fa-bell" />
                {!this.props.isMobile && (
                    <div id="notification-list" className="notification-list dropdown-menu shadow-sm show" style={{ visibility: 'hidden' }}>
                        <div className="dropdown-item notification-header">
                            <span>Notification</span>
                        </div>
                        <div className="notification-items-container">
                            <Simplebar style={{ maxHeight: '350px' }}>
                                {this.state.data.length > 0 ? (
                                    this.state.data.map((item, index) => {
                                        return <NotificationItem key={`notifkey-${index}`} {...item} />;
                                    })
                                ) : (
                                    <div className="d-flex justify-content-center align-items-center">
                                        <NotificationSVG />
                                        {/* <span className="position-absolute bg-white">Nothing new</span> */}
                                    </div>
                                )}
                            </Simplebar>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default Notification;
