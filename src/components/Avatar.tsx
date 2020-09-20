import React from 'react';

import View from 'components/View';
import { Primary } from 'themes/styles';

type AvatarProps = {
    name: string;
    image: string | null;
};

class Avatar extends React.Component<AvatarProps> {
    GetInitial() {
        const string = '';

        return string;
    }

    render() {
        return (
            <React.Fragment>
                <View>{this.props.name}</View>
                <View
                    id="avatar"
                    className="avatar ml-2"
                    backgroundColor={Primary}
                    backgroundImage={`url(${this.props.image})`}
                >
                    {this.GetInitial()}
                </View>
            </React.Fragment>
        );
    }
}

export default Avatar;
