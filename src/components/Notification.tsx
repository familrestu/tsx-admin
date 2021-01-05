import React, { Component } from 'react';
import { Badge } from 'react-bootstrap';
import Simplebar from 'simplebar-react';
import Icon from 'components/Icon';

type NotificationPropsType = {
    isMobile: boolean;
};

type NotificationStateType = {
    counter: number;
};

class Notification extends Component<NotificationPropsType, NotificationStateType> {
    state = {
        counter: 999,
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

    HideShowedNotificationDetailsHandler() {
        const arrShowedDetails = document.querySelectorAll('.dropdown-items-container .showdetails');

        for (let i = 0; i < arrShowedDetails.length; i++) {
            const element = arrShowedDetails[i];
            (element as HTMLDivElement).classList.remove('showdetails');
        }

        const arrDetails = document.querySelectorAll('.dropdown-items-container .details');

        for (let i = 0; i < arrDetails.length; i++) {
            const element = arrDetails[i];
            (element as HTMLDivElement).style.height = '0px';
        }

        const notifContainer = document.getElementById('dropdown-menu');
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
        return (
            <div id="notification" className="notification icon-groups mx-2 pointer btn-open-dropdown" tabIndex={0} /* add tabIndex for adding focus */>
                {this.state.counter > 0 && (
                    <Badge className="position-absolute badge-counter" variant="danger">
                        {this.state.counter > 99 ? '99+' : this.state.counter}
                    </Badge>
                )}
                <Icon name="fas fa-bell" />
                {!this.props.isMobile && (
                    <div id="dropdown-menu" className="position-absolute dropdown-menu p-0 shadow-sm show" style={{ visibility: 'hidden' }}>
                        <div className="dropdown-item dropdown-header">
                            <span>Notification</span>
                        </div>
                        <div className="dropdown-items-container">
                            <Simplebar style={{ maxHeight: '350px' }}>
                                {[0, 1, 2, 3, 4].map((index) => {
                                    return (
                                        <div key={index} className="dropdown-item" onClick={(e: React.MouseEvent) => this.ShowDetailHandler(e)}>
                                            <div className="dropdown-icon">
                                                <i className="fas fa-calendar-day"></i>
                                            </div>
                                            <div className="dropdown-content showdetails">
                                                <div className="dropdown-title">
                                                    <span>26 Sept, 2020</span>
                                                    <i className="fas fa-chevron-left"></i>
                                                </div>
                                                <div className="dropdown-body">
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

                                                        <div className="approver bold">
                                                            Approval 1
                                                            <br />
                                                            Approval 2
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="dropdown-footer">
                                                    <span className="text-right">Unverified</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </Simplebar>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default Notification;
