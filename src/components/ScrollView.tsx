import React from 'react';

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
    ScrollEvent: HTMLDivElement | null | undefined;
    componentDidMount() {
        this.ScrollEvent?.addEventListener('scroll', (e) => {
            console.log(e);
        });
        console.log(this.ScrollEvent);
    }
    render() {
        return (
            <div
                ref={(ref) => (this.ScrollEvent = ref)}
                id={
                    typeof this.props.id !== 'undefined'
                        ? `${this.props.id}`
                        : 'scrollview'
                }
                className={
                    typeof this.props.className !== 'undefined'
                        ? `${this.props.className}`
                        : 'scrollview'
                }
                // onScrollCapture={(e) => console.log(e)}
                component-name={this.props.className}
                {...this.props.attributes}
            >
                {this.props.children}

                {this.props.showVerticalScrollIndicator && (
                    <div className="scrollview-bar-vertical-track"></div>
                )}

                {this.props.showHorizontalScrollIndicator && (
                    <div className="scrollview-bar-horizontal-track"></div>
                )}
            </div>
        );
    }
}

export default ScrollView;
