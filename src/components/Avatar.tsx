import React, { useState, useEffect } from 'react';
import CSS from 'csstype';
import { useSelector } from 'react-redux';
import { AppState } from 'redux/store';
import { GetInitial } from 'libs/utils';

type AvatarProps = {
    className?: string;
    style?: CSS.Properties;
};

const Avatar: React.FC<AvatarProps> = (props: AvatarProps) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const UserState = useSelector((state: { UserState: AppState['UserState'] }) => state.UserState);
    // let path = `${process.env.REACT_APP_FILES_PATH}`;
    let path = '';

    if (UserState.profile_picture !== null && UserState.company_code !== null) {
        if (UserState.profile_picture.indexOf('http') >= 0 || UserState.profile_picture.indexOf('https') >= 0) {
            path = UserState.profile_picture;
        } else {
            path += `${process.env.REACT_APP_FILES_PATH}${UserState.company_code}/profile_picture/${UserState.profile_picture}`;
        }
    }

    if (path) {
        useEffect(() => {
            fetch(path)
                .then((res) => {
                    return res.blob();
                })
                .then((image) => {
                    if (image.type.indexOf('image') >= 0) {
                        setImageLoaded(true);
                    }
                });
        }, []);
    }

    return (
        <div className="avatar-outline">
            <div
                id="avatar"
                className={`avatar ${props.className !== undefined ? props.className : ''}`.trim()}
                style={{
                    backgroundImage: UserState.profile_picture !== null ? `url(${path})` : undefined,
                    ...props.style,
                }}
            >
                {!imageLoaded && <span>{UserState.displayname !== null ? GetInitial(UserState.displayname) : ''}</span>}
            </div>
        </div>
    );
};

export default Avatar;
