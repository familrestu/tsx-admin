import React from 'react';
import CSS from 'csstype';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { AppState } from 'redux/store';

type AvatarState = {
    isImageLoaded: boolean;
};

export type AvatarProps = {
    name?: string;
    position?: string;
    company?: string;
    className?: string;
    image?: string | null;
    tooltip?: boolean;
    children?: React.ReactNode;
    attributes?: { [key: string]: string | number };
    style?: CSS.Properties;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    DropDownOnBlurHandler?: any;
    dropdownParent?: boolean;

    SignOutHandler?: () => void;
};

export class AvatarImage extends React.Component<AvatarProps, AvatarState> {
    state = {
        isImageLoaded: false,
    };

    CheckImage() {
        if (this.props.image !== undefined && this.props.image !== null) {
            fetch(this.props.image)
                .then((res) => {
                    return res.blob();
                })
                .then((image) => {
                    if (image.type === 'image/jpeg') {
                        this.setState({ isImageLoaded: true });
                    }
                });
        }
    }

    GetInitial() {
        let firstChar = '';
        let secondChar = '';

        /* set string as Array */
        if (this.props.name) {
            const arrString = this.props.name.split(' ');

            if (arrString.length > 1) {
                firstChar = arrString[0].toString().toUpperCase()[0];
                secondChar = arrString[arrString.length - 1].toString().toUpperCase()[0];
            } else {
                firstChar = this.props.name[0].toUpperCase();
                secondChar = this.props.name[this.props.name.length - 1].toUpperCase();
            }

            return `${firstChar}${secondChar}`;
        } else {
            return ' ';
        }
    }

    componentDidMount() {
        this.CheckImage();
    }

    render() {
        return (
            <div
                id="avatar"
                className={`avatar ${this.props.dropdownParent !== undefined ? 'btn-open-dropdown' : ''} ${this.props.className !== undefined ? this.props.className : ''}`.trim()}
                {...this.props.attributes}
                style={{
                    backgroundImage: this.props.image !== undefined ? `url(${this.props.image})` : '',
                    ...this.props.style,
                }}
            >
                {!this.state.isImageLoaded && <span>{this.GetInitial()}</span>}
                {this.props.children}
            </div>
        );
    }
}

class Avatar extends React.Component<AvatarProps & AppState & typeof MapDispatch> {
    ToggleKeepFocusHandler(e: React.MouseEvent, type: number) {
        const target = (e.currentTarget.parentElement as HTMLDivElement).parentElement;

        if (target !== null) {
            if (type === 0) {
                target.setAttribute('keep-focus', '1');
            } else if (type === 1) {
                target.removeAttribute('keep-focus');

                if (e.type === 'click') {
                    (e.currentTarget.parentElement as HTMLDivElement).classList.remove('show');
                }
            }
        }
    }

    render() {
        return (
            <div className="avatar-container">
                <div className="avatar-user-name">{this.props.name}</div>
                <AvatarImage attributes={{ tabIndex: 0 }} dropdownParent {...this.props}>
                    <div className="dropdown-menu p-0 shadow">
                        <div className="d-flex justify-content-center dropdown-item border-bottom nohover">
                            <div className="d-flex flex-column">
                                <div className="nowrap text-center">{this.props.name}</div>
                            </div>
                        </div>
                        <NavLink
                            exact
                            to="/profile"
                            onMouseEnter={(e: React.MouseEvent) => this.ToggleKeepFocusHandler(e, 0)}
                            onMouseLeave={(e: React.MouseEvent) => this.ToggleKeepFocusHandler(e, 1)}
                            onClick={(e: React.MouseEvent) => this.ToggleKeepFocusHandler(e, 1)}
                        >
                            <div className="d-flex dropdown-item small justify-content-start align-items-center">
                                <span className="text-black">Your Profile</span>
                            </div>
                        </NavLink>
                        <NavLink
                            exact
                            to={{
                                pathname: '/profile',
                                state: 'accountInformation',
                            }}
                            onMouseEnter={(e: React.MouseEvent) => this.ToggleKeepFocusHandler(e, 0)}
                            onMouseLeave={(e: React.MouseEvent) => this.ToggleKeepFocusHandler(e, 1)}
                            onClick={(e: React.MouseEvent) => this.ToggleKeepFocusHandler(e, 1)}
                        >
                            <div className="d-flex dropdown-item small justify-content-start align-items-center border-bottom">
                                <span className="text-black">Change Password</span>
                            </div>
                        </NavLink>
                        <div
                            onClick={() => {
                                if (this.props.SignOutHandler) {
                                    this.props.SignOutHandler();
                                }
                            }}
                        >
                            <div className="d-flex dropdown-item small justify-content-start align-items-center">
                                <span className="text-black">Sign out</span>
                            </div>
                        </div>
                    </div>
                </AvatarImage>
            </div>
        );
    }
}

const MapStateToProps = (state: AppState) => ({
    UserState: state.UserState,
});

const MapDispatch = {
    Logout: () => ({ type: 'LOGOUT' }),
};

export default connect(MapStateToProps, MapDispatch)(Avatar);
