import React, { ReactNode } from 'react';
import CSS from 'csstype';

type CSSTypes = {
    backgroundColor?: CSS.Property.BackgroundColor;
    backgroundImage?: CSS.Property.BackgroundImage;
    backgroundPosition?: CSS.Property.BackgroundPosition;
    backgroundSize?: CSS.Property.BackgroundSize;
    backgroundRepeat?: CSS.Property.BackgroundRepeat;
    background?: CSS.Property.Background;
};

type ViewProps = {
    shadow?: boolean;
    tabIndex?: number;
    id?: string;
    className?: string;
    children?: ReactNode;
};

type Props = ViewProps & CSSTypes;

class View extends React.Component<Props> {
    render() {
        const styles: CSSTypes = {
            ...this.props,
        };

        return (
            <div
                id={
                    typeof this.props.id !== 'undefined'
                        ? `${this.props.id}`
                        : ''
                }
                className={
                    typeof this.props.className !== 'undefined'
                        ? `view ${this.props.className}`
                        : 'view'
                }
                component-name="view"
                tabIndex={this.props.tabIndex}
                style={styles}
            >
                {this.props.children}
            </div>
        );
    }
}

export default View;
