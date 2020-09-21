import React from 'react';
import CSS from 'csstype';

type Props = {
    name: string;
    fontSize?: CSS.Property.FontSize;
    onClick?: (e: React.MouseEvent) => void;
};

class Icon extends React.Component<Props> {
    render() {
        const styles: CSS.Properties = {
            ...this.props,
        };

        if (typeof this.props.onClick !== 'undefined') {
            styles.cursor = 'pointer';
        }

        return (
            <i
                className={`${this.props.name}`}
                style={styles}
                onClick={this.props.onClick}
            ></i>
        );
    }
}

export default Icon;
