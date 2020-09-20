import React from 'react';
import CSS from 'csstype';
import { Shadow } from 'themes/styles';

type AbsoluteProps = {
    top?: CSS.Property.Top;
    right?: CSS.Property.Right;
    bottom?: CSS.Property.Bottom;
    left?: CSS.Property.Left;
    margin?: CSS.Property.Margin;
    marginTop?: CSS.Property.MarginTop;
    marginRight?: CSS.Property.MarginRight;
    marginBottom?: CSS.Property.MarginBottom;
    marginLeft?: CSS.Property.MarginLeft;
    padding?: CSS.Property.Padding;
    paddingTop?: CSS.Property.PaddingTop;
    paddingRight?: CSS.Property.PaddingRight;
    paddingBottom?: CSS.Property.PaddingBottom;
    paddingLeft?: CSS.Property.PaddingLeft;
    borderRadius?: CSS.Property.BorderRadius;
    borderTopRightRadius?: CSS.Property.BorderTopRightRadius;
    borderBottomRightRadius?: CSS.Property.BorderBottomRightRadius;
    borderBottomLeftRadius?: CSS.Property.BorderBottomLeftRadius;
    borderTopLeftRadius?: CSS.Property.BorderTopLeftRadius;
    borderWidth?: CSS.Property.BorderWidth;
    borderTopWidth?: CSS.Property.BorderTopWidth;
    borderRightWidth?: CSS.Property.BorderRightWidth;
    borderBottomWidth?: CSS.Property.BorderBottomWidth;
    borderLeftWidth?: CSS.Property.BorderLeftWidth;
    borderTopColor?: CSS.Property.BorderTopColor;
    borderRightColor?: CSS.Property.BorderRightColor;
    borderBottomColor?: CSS.Property.BorderBottomColor;
    borderLeftColor?: CSS.Property.BorderLeftColor;
    borderColor?: CSS.Property.BorderColor;
    borderStyle?: CSS.Property.BorderStyle;
    border?: CSS.Property.Border;
    height?: CSS.Property.Height;
    minHeight?: CSS.Property.MinHeight;
    maxHeight?: CSS.Property.MaxHeight;
    width?: CSS.Property.Width;
    minWidth?: CSS.Property.MinWidth;
    maxWidth?: CSS.Property.MaxWidth;
    backgroundColor?: CSS.Property.BackgroundColor;
    backgroundImage?: CSS.Property.BackgroundImage;
    backgroundPosition?: CSS.Property.BackgroundPosition;
    backgroundSize?: CSS.Property.BackgroundSize;
    backgroundRepeat?: CSS.Property.BackgroundRepeat;
    background?: CSS.Property.Background;
    transition?: CSS.Property.Transition;
    zIndex?: CSS.Property.ZIndex;
    transparent?: boolean;
    shadow?: boolean;
    opacity?: CSS.Property.Opacity;
    id?: string;
    className?: string;
    attributes?: Record<string, unknown> | undefined;
    onClick?: () => void;
    onMouseOver?: () => void;
    onMouseOut?: () => void;
};

type Props = AbsoluteProps;

class Absolute extends React.Component<Props> {
    render() {
        let styles: CSS.Properties = {
            position: 'absolute',
            ...this.props,
        };

        if (typeof this.props.shadow !== 'undefined') {
            styles = { ...styles, ...Shadow };
        }

        if (typeof this.props.transparent !== 'undefined') {
            styles.backgroundColor = 'transparent';
        }

        if (typeof this.props.onClick !== 'undefined') {
            styles.cursor = 'pointer';
        }

        return (
            <div
                id={
                    typeof this.props.id !== 'undefined'
                        ? `absolute-${this.props.id} ${this.props.id}`
                        : 'absolute'
                }
                className={`${
                    typeof this.props.className !== 'undefined'
                        ? `absolute absolute-${this.props.className} ${this.props.className}`
                        : 'absolute'
                } ${this.props.onClick ? 'onclick' : ''}`}
                style={styles}
                {...this.props.attributes}
                onClick={this.props.onClick}
                onMouseOver={this.props.onMouseOver}
                onMouseOut={this.props.onMouseOut}
            >
                {this.props.children}
            </div>
        );
    }
}

export default Absolute;
