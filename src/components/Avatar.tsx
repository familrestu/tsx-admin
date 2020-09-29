import React from 'react';
import CSS from 'csstype';

type AvatarState = {
    isImageLoaded: boolean;
};

export type AvatarProps = {
    name: string;
    position: string;
    company?: string;
    className?: string;
    image?: string;
    tooltip?: boolean;
    children?: React.ReactNode;
    attributes?: { [key: string]: string | number };
    style?: CSS.Properties;
};

export class AvatarImage extends React.Component<AvatarProps, AvatarState> {
    state = {
        isImageLoaded: false,
    };

    CheckImage() {
        if (this.props.image !== undefined) {
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
            secondChar = arrString[arrString.length - 1]
                .toString()
                .toUpperCase()[0];
        } else {
            firstChar = this.props.name[0].toUpperCase();
            secondChar = this.props.name[
                this.props.name.length - 1
            ].toUpperCase();
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
                className={`avatar ${
                    this.props.children !== undefined ? 'btn-open-dropdown' : ''
                } ${
                    this.props.className !== undefined
                        ? this.props.className
                        : ''
                }`}
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
    render() {
        return (
            <div className="position-relative avatar-container d-flex pointer align-items-center br-4">
                <div className="mr-3">{this.props.name}</div>
                <AvatarImage attributes={{ tabIndex: 0 }} {...this.props}>
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
                                <div className="nowrap text-center">
                                    {this.props.name}
                                </div>
                                <div className="nowrap text-center text-gray small">
                                    {this.props.position}
                                </div>
                                <div className="nowrap text-center text-gray small">
                                    {this.props.company}
                                </div>
                            </div>
                        </div>
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
