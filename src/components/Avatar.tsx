import React from 'react';
import CSS from 'csstype';
import { connect } from 'react-redux';
import { AppState } from 'redux/store';
import Navlink from 'components/Navlink';

type AvatarState = {
    isImageLoaded: boolean;
};

type AvatarProps = {
    name?: string | null;
    position?: string;
    company?: string;
    className?: string;
    image?: string | null;
    tooltip?: boolean;
    children?: React.ReactNode;
    attributes?: { [key: string]: string | number };
    style?: CSS.Properties;
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

class Avatar extends React.Component<AvatarProps & MapStateToPropsType> {
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
            <div className="avatar-container btn-open-dropdown" tab-index={0}>
                <AvatarImage attributes={{ tabIndex: 0 }}></AvatarImage>
                <div className="dropdown-menu p-0 shadow">
                    <div className="d-flex justify-content-center dropdown-item border-bottom nohover">
                        <div className="d-flex flex-column">
                            <div className="nowrap text-center">{this.props.name}</div>
                        </div>
                    </div>
                    <Navlink
                        to={{
                            pathname: '/profile',
                            state: {
                                tab: '/profile/personal-information',
                            },
                        }}
                        onMouseEnter={(e: React.MouseEvent) => this.ToggleKeepFocusHandler(e, 0)}
                        onMouseLeave={(e: React.MouseEvent) => this.ToggleKeepFocusHandler(e, 1)}
                        onClick={(e: React.MouseEvent) => this.ToggleKeepFocusHandler(e, 1)}
                    >
                        <div className="d-flex dropdown-item small justify-content-start align-items-center">
                            <span className="text-black">Your Profile</span>
                        </div>
                    </Navlink>
                    <Navlink
                        to={{
                            pathname: '/profile',
                            state: {
                                tab: '/profile/account-information',
                            },
                        }}
                        onMouseEnter={(e: React.MouseEvent) => this.ToggleKeepFocusHandler(e, 0)}
                        onMouseLeave={(e: React.MouseEvent) => this.ToggleKeepFocusHandler(e, 1)}
                        onClick={(e: React.MouseEvent) => this.ToggleKeepFocusHandler(e, 1)}
                    >
                        <div className="d-flex dropdown-item small justify-content-start align-items-center">
                            <span className="text-black">Change Password</span>
                        </div>
                    </Navlink>
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
            </div>
        );
    }
}

type MapStateToPropsType = {
    UserState: AppState['UserState'];
};

const MapStateToProps = (state: MapStateToPropsType) => ({
    UserState: state.UserState,
});

export default connect(MapStateToProps)(Avatar);
