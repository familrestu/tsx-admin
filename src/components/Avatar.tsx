import React from 'react';
import CSS from 'csstype';
import { NavLink } from 'react-router-dom';

type AvatarState = {
    isImageLoaded: boolean;
};

export type AvatarProps = {
    name: string;
    position: string;
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
        const arrString = this.props.name.split(' ');

        if (arrString.length > 1) {
            firstChar = arrString[0].toString().toUpperCase()[0];
            secondChar = arrString[arrString.length - 1].toString().toUpperCase()[0];
        } else {
            firstChar = this.props.name[0].toUpperCase();
            secondChar = this.props.name[this.props.name.length - 1].toUpperCase();
        }

        return `${firstChar}${secondChar}`;
    }

    componentDidMount() {
        this.CheckImage();
    }

    render() {
        return (
            <div
                id="avatar"
                className={`avatar ${this.props.dropdownParent !== undefined ? 'btn-open-dropdown' : ''} ${this.props.className !== undefined ? this.props.className : ''}`}
                {...this.props.attributes}
                style={{
                    backgroundImage: `url(${this.props.image})`,
                    ...this.props.style,
                }}
            >
                {!this.state.isImageLoaded && <span>{this.GetInitial()}</span>}
                {this.props.children}
            </div>
        );
    }
}

class Avatar extends React.Component<AvatarProps> {
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
            <div className="position-relative avatar-container d-flex align-items-center br-4">
                <div className="mr-3">{this.props.name}</div>
                <AvatarImage attributes={{ tabIndex: 0 }} dropdownParent {...this.props}>
                    <div className="position-absolute dropdown-menu p-0 shadow">
                        <div className="d-flex p-4 justify-content-center dropdown-item">
                            <div className="d-flex flex-column">
                                <div className="d-flex justify-content-center align-items-center mb-4">
                                    <AvatarImage
                                        style={{
                                            width: '75px',
                                            height: '75px',
                                            fontSize: '2rem',
                                        }}
                                        {...this.props}
                                    />
                                </div>
                                <div className="nowrap text-center">{this.props.name}</div>
                                <div className="nowrap text-center text-black small">{this.props.position}</div>
                                <div className="nowrap text-center text-black small">{this.props.company}</div>
                            </div>
                        </div>
                        <NavLink
                            exact
                            to="/profile"
                            onMouseEnter={(e: React.MouseEvent) => this.ToggleKeepFocusHandler(e, 0)}
                            onMouseLeave={(e: React.MouseEvent) => this.ToggleKeepFocusHandler(e, 1)}
                            onClick={(e: React.MouseEvent) => this.ToggleKeepFocusHandler(e, 1)}
                        >
                            <div className="d-flex p-3 dropdown-item small justify-content-start align-items-center">
                                <span className="text-black" style={{ fontWeight: 'unset' }}>
                                    Your Profile
                                </span>
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
                            <div className="d-flex p-3 dropdown-item small justify-content-start align-items-center">
                                {/* <i className="fas fa-key mr-2"></i> */}
                                <span className="text-black" style={{ fontWeight: 'unset' }}>
                                    Change Password
                                </span>
                            </div>
                        </NavLink>
                        <div className="d-flex p-3 justify-content-center">
                            <div className="btn btn-primary">Sign out</div>
                        </div>
                    </div>
                </AvatarImage>
            </div>
        );
    }
}

export default Avatar;
