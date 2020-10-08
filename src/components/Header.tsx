import React from 'react';
import { InputGroup, FormControl, Button } from 'react-bootstrap';
import Simplebar from 'simplebar-react';

import Avatar from 'components/Avatar';
import Icon from 'components/Icon';
import { DividerVertical } from 'components/Divider';

import { connect } from 'react-redux';
import { AppState } from 'redux/store';

class NotificationBells extends React.Component {
    ShowDetailHandler(element: React.MouseEvent) {
        const currentTarget = element.currentTarget as HTMLDivElement;
        if (currentTarget.lastChild !== null) {
            (currentTarget.lastChild as HTMLDivElement).classList.toggle(
                'showdetails',
            );

            const detailsElement = (currentTarget.lastChild as HTMLDivElement)
                .children[1].children[1] as HTMLDivElement;

            if (detailsElement !== null) {
                const expandedHeight = detailsElement.getAttribute(
                    'expanded-height',
                );

                if (
                    (currentTarget.lastChild as HTMLDivElement).classList.value.indexOf(
                        'showdetails',
                    ) > 0
                ) {
                    detailsElement.style.height = `${expandedHeight}px`;
                } else {
                    detailsElement.style.height = '0px';
                }
            }
        }
    }

    HideShowedNotificationDetailsHandler() {
        const arrShowedDetails = document.querySelectorAll(
            '.dropdown-items-container .showdetails',
        );

        for (let i = 0; i < arrShowedDetails.length; i++) {
            const element = arrShowedDetails[i];
            (element as HTMLDivElement).classList.remove('showdetails');
        }

        const arrDetails = document.querySelectorAll(
            '.dropdown-items-container .details',
        );

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

    render() {
        return (
            <div
                className="icon-groups mx-2 pointer btn-open-dropdown btn-ripple btn-ripple-white"
                tabIndex={0} /* add tabIndex for adding focus */
            >
                <div className="position-absolute badge badge-danger badge-counter">
                    99+
                </div>
                <Icon name="fas fa-bell" />
                <div
                    id="dropdown-menu"
                    className="position-absolute dropdown-menu p-0 shadow show"
                    style={{ visibility: 'hidden' }}
                >
                    <div className="dropdown-item dropdown-header">
                        <span>Notification</span>
                    </div>
                    <div className="dropdown-items-container">
                        <Simplebar style={{ maxHeight: '350px' }}>
                            {[0, 1, 2, 3, 4].map((index) => {
                                return (
                                    <div
                                        key={index}
                                        className="dropdown-item"
                                        onClick={(e: React.MouseEvent) =>
                                            this.ShowDetailHandler(e)
                                        }
                                    >
                                        <div className="dropdown-icon">
                                            <i className="fas fa-calendar-day"></i>
                                        </div>
                                        <div className="dropdown-content showdetails">
                                            <div className="dropdown-title">
                                                <span>26 Sept, 2020</span>
                                                <i className="fas fa-chevron-left"></i>
                                            </div>
                                            <div className="dropdown-body">
                                                <div className="preview">
                                                    Leave Request for Famil
                                                    Restu Pambudi
                                                </div>
                                                <div
                                                    className="details"
                                                    ref={(ref) => {
                                                        if (ref !== null) {
                                                            ref.setAttribute(
                                                                'expanded-height',
                                                                ref.offsetHeight.toString(),
                                                            );
                                                        }
                                                    }}
                                                >
                                                    <div>
                                                        Request Date: 2 Oct,
                                                        2020 - 2 Oct, 2020
                                                    </div>
                                                    <div>Leave Balance: 12</div>

                                                    <div className="approver bold">
                                                        Approval 1
                                                        <br />
                                                        Approval 2
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="dropdown-footer">
                                                <span className="text-right">
                                                    Unverified
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </Simplebar>
                    </div>
                </div>
            </div>
        );
    }
}

class Header extends React.Component<AppState> {
    OpenDropDownHandler(e: Event, element: Element) {
        const target = e.target as HTMLDivElement;
        if (target.classList.value.indexOf('btn-open-dropdown') > 0) {
            (element.lastChild as HTMLDivElement).classList.toggle('show');
            (element as HTMLDivElement).focus();
        }
    }

    DropDownOnBlurHandler(element: Element) {
        const keepFocus = element.getAttribute('keep-focus');

        if (keepFocus === null) {
            (element.lastChild as HTMLDivElement).classList.remove('show');
        }
    }

    /* adding btn dropdown listener for header, so any existing btn-open-dropdown will show it's hidden last chidlren */
    AddOpenDrowndownListener() {
        const arrBtnDropDown = document.querySelectorAll(
            '.header .btn-open-dropdown',
        );

        if (arrBtnDropDown !== null) {
            for (let i = 0; i < arrBtnDropDown.length; i++) {
                const element = arrBtnDropDown[i];

                /* element.addEventListener('click', (e: Event) =>
                    this.OpenDropDownHandler(e, element),
                ); */

                element.addEventListener('click', (e: Event) =>
                    this.OpenDropDownHandler(e, element),
                );

                element.addEventListener('blur', () =>
                    this.DropDownOnBlurHandler(element),
                );
            }
        }
    }

    ToggleNavbarHandler() {
        const navbar = document.getElementById('navbar-left');

        if (navbar !== null) {
            navbar.classList.toggle('closed');
        }
    }

    componentDidMount() {
        this.AddOpenDrowndownListener();
    }

    render() {
        const { UserState } = this.props;
        const AvatarProps = {
            name: UserState !== undefined ? UserState.full_name : '',
            position: UserState !== undefined ? UserState.position_name : '',
            image: UserState !== undefined ? UserState.profile_picture : '',
            company: UserState !== undefined ? UserState.company_name : '',
        };

        return (
            <div
                id="header"
                className="header position-relative d-flex align-items-center shadow"
            >
                <div
                    className="position-relative h-100 d-flex align-items-center justify-content-center"
                    style={{ flex: '0.5 1 auto' }}
                >
                    <Button
                        className="mr-4 btn-ripple btn-ripple-primary"
                        onClick={() => this.ToggleNavbarHandler()}
                    >
                        <Icon name="fas fa-bars" />
                    </Button>
                    <InputGroup>
                        <FormControl placeholder="Search..." />
                        <InputGroup.Append>
                            <Button className="btn-ripple btn-ripple-primary">
                                <Icon name="fas fa-search" />
                            </Button>
                        </InputGroup.Append>
                    </InputGroup>
                </div>
                <div
                    className="position-relative h-100 d-flex align-items-center justify-content-end"
                    style={{ flex: '1 1 auto' }}
                >
                    <NotificationBells />
                    <DividerVertical marginLeft marginRight />
                    <Avatar
                        {...AvatarProps}
                        DropDownOnBlurHandler={this.DropDownOnBlurHandler}
                    />
                </div>
            </div>
        );
    }
}

export const MapStateToProps = (state: AppState) => ({
    UserState: state.UserState,
});

export default connect(MapStateToProps)(Header);
