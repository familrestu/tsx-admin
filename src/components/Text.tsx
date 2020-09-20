import React from 'react';
import CSS from 'csstype';

type TextProps = {
    children?: string | React.ReactChild[] | undefined;
    color?: CSS.Property.Color;
    fontWeight?: CSS.Property.FontWeight;
    textAlign?: CSS.Property.TextAlign;
    fontFamily?: CSS.Property.FontFamily;
    fontSize?: CSS.Property.FontSize;
    lineHeight?: CSS.Property.LineHeight;
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
    height?: CSS.Property.Height;
    minHeight?: CSS.Property.MinHeight;
    maxHeight?: CSS.Property.MaxHeight;
    width?: CSS.Property.Width;
    bold?: boolean;
    underline?: boolean;
    italic?: boolean;
    id?: string;
    className?: string;
    link?: string;
    title?: string;
    inline?: boolean;
};

type Props = TextProps;

class Text extends React.Component<Props> {
    clickHandler() {
        if (typeof this.props.link !== 'undefined') {
            window.open(this.props.link);
        }
    }

    render() {
        let returnElement = null;
        const styles: CSS.Properties = {
            display:
                typeof this.props.inline === 'undefined'
                    ? 'inline-block'
                    : this.props.inline
                    ? 'inline-block'
                    : 'block',
            // height: 'min-content',
            // width: 'max-content',
            ...this.props,
        };

        if (typeof this.props.bold !== 'undefined' && this.props.bold) {
            styles.fontWeight = 'bold';
        }

        if (
            typeof this.props.underline !== 'undefined' &&
            this.props.underline
        ) {
            styles.textDecoration = 'underline';
        }

        if (typeof this.props.italic !== 'undefined' && this.props.italic) {
            styles.fontStyle = 'italic';
        }

        if (typeof this.props.link !== 'undefined') {
            styles.cursor = 'pointer';
        }

        if (typeof this.props.children !== 'undefined') {
            if (
                typeof this.props.children === 'string' &&
                this.props.children.split(' ').length > 10
            ) {
                returnElement = (
                    <p
                        id={
                            typeof this.props.id !== 'undefined'
                                ? `text-${this.props.id} ${this.props.id}`
                                : 'text'
                        }
                        className={
                            typeof this.props.className !== 'undefined'
                                ? `text text-${this.props.className} ${this.props.className}`
                                : 'text'
                        }
                        style={styles}
                        onClick={() => this.clickHandler()}
                        {...this.props}
                    >
                        {this.props.children}
                    </p>
                );
            } else {
                returnElement = (
                    <span
                        id={
                            typeof this.props.id !== 'undefined'
                                ? `text text-${this.props.id}`
                                : 'text'
                        }
                        className={
                            typeof this.props.className !== 'undefined'
                                ? `text text-${this.props.className} ${this.props.className}`
                                : 'text'
                        }
                        style={styles}
                        onClick={() => this.clickHandler()}
                        // {...this.props}
                    >
                        {this.props.children}
                    </span>
                );
            }
        }

        return returnElement;
    }
}
export default Text;
