import React from 'react';
import CSS from 'csstype';

type Props = {
    name: string;
    fontSize?: CSS.Property.FontSize;
};

class Icon extends React.Component<Props> {
    render() {
        const styles: CSS.Properties = {
            ...this.props,
        };
        return <i className={`${this.props.name}`} style={styles}></i>;
    }
}

export default Icon;
