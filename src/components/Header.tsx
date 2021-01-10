import React from 'react';
import { InputGroup, FormControl, Button } from 'react-bootstrap';

import Avatar from 'components/Avatar';
import Icon from 'components/Icon';
import { DividerVertical } from 'components/Divider';

import { connect } from 'react-redux';
import { AppState } from 'redux/store';

import Notification from 'components/Notification';

type HeaderPropsType = {
    ToggleNavbarHandler: () => void;
    SignOutHandler: () => void;
    isMobile: boolean;
};

class Header extends React.Component<HeaderPropsType & AppState> {
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
        const arrBtnDropDown = document.querySelectorAll('.header-container .btn-open-dropdown');

        if (arrBtnDropDown !== null) {
            for (let i = 0; i < arrBtnDropDown.length; i++) {
                const element = arrBtnDropDown[i];
                element.addEventListener('click', (e: Event) => this.OpenDropDownHandler(e, element));
                element.addEventListener('blur', () => this.DropDownOnBlurHandler(element));
            }
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
            <div id="header-container" className="header-container shadow-sm">
                <div className="header-left">
                    <Button className="mr-4" onClick={this.props.ToggleNavbarHandler}>
                        <Icon name="fas fa-bars" />
                    </Button>
                    <InputGroup>
                        <FormControl placeholder="Search..." />
                        <InputGroup.Append>
                            <Button>
                                <Icon name="fas fa-search" />
                            </Button>
                        </InputGroup.Append>
                    </InputGroup>
                </div>
                <div className="header-right">
                    <Notification isMobile={this.props.isMobile} />
                    <DividerVertical marginLeft marginRight />
                    <Avatar {...AvatarProps} DropDownOnBlurHandler={this.DropDownOnBlurHandler} SignOutHandler={() => this.props.SignOutHandler()} />
                </div>
            </div>
        );
    }
}

export const MapStateToProps = (state: AppState) => ({
    UserState: state.UserState,
});

export default connect(MapStateToProps)(Header);
