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

type FlexProps = {
    shadow?: boolean;
    id?: string;
    className?: string;
    children?: ReactNode;
};

type Props = FlexProps & CSSTypes;

class Flex extends React.Component<Props> {
    render() {
        const styles: CSSTypes = {
            backgroundColor: this.props.backgroundColor,
            backgroundImage: this.props.backgroundImage,
            backgroundPosition: this.props.backgroundPosition,
            backgroundSize: this.props.backgroundSize,
            backgroundRepeat: this.props.backgroundRepeat,
            background: this.props.background,
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
                        ? `flex ${this.props.className}`
                        : 'flex'
                }
                component-name="flex"
                style={{ ...styles }}
            >
                {this.props.children}
            </div>
        );
    }
}

export default Flex;
