import React from 'react';
import CSS from 'csstype';

type ScrollViewProps = {
    children?: React.ReactChild[] | React.ReactChild | Element | Element[];
    horizontal?: boolean;
    showVerticalScrollIndicator?: boolean;
    showHorizontalScrollIndicator?: boolean;
    id?: string;
    className?: string;
    attributes?: Record<string, unknown> | undefined;
};

type Props = ScrollViewProps;

class ScrollView extends React.Component<Props> {
    render() {
        const styles: CSS.Properties = {
            position: 'relative',
            width: '100%',
            height: '100%',
        };

        if (
            typeof this.props.horizontal !== 'undefined' &&
            this.props.horizontal
        ) {
            styles.overflowX = 'auto';
            styles.overflowY = 'hidden';
        } else {
            styles.overflowX = 'hidden';
            styles.overflowY = 'auto';
        }

        return (
            <div
                id={
                    typeof this.props.id !== 'undefined'
                        ? `scrollview-${this.props.id}`
                        : 'scrollview'
                }
                className={
                    typeof this.props.className !== 'undefined'
                        ? `scrollview scrollview-${this.props.className}`
                        : 'scrollview'
                }
                style={styles}
                {...this.props.attributes}
            >
                {this.props.children}
            </div>
        );
    }
}

export default ScrollView;
