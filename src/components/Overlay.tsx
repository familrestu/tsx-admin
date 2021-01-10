import React, { Component } from 'react';
import ReactDOM from 'react-dom';

type OverlayType = {
    children?: React.ReactChild[] | React.ReactChild | Element | Element[];
};

class Portal extends Component<OverlayType> {
    rootElement: HTMLElement = document.body;
    element: HTMLDivElement;

    constructor(props: OverlayType) {
        super(props);

        this.element = document.createElement('div');
        this.element.classList.add('overlay');
        this.element.id = 'overlay';
    }

    componentDidMount() {
        if (this.rootElement) {
            this.rootElement.appendChild(this.element);
        }
    }

    componentWillUnmount() {
        if (this.rootElement) {
            this.rootElement.removeChild(this.element);
        }
    }

    render() {
        return ReactDOM.createPortal(this.props.children, this.element);
    }
}

export default Portal;
