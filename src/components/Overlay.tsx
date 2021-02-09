import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
// import { AppState } from 'redux/store';

type OverlayType = {
    children?: React.ReactChild[] | React.ReactChild | Element | Element[] | null;
};

class Overlay extends Component<OverlayType & typeof MapDispatch> {
    rootElement: HTMLElement | null = document.getElementById('root-container');
    element: HTMLDivElement;

    constructor(props: OverlayType & typeof MapDispatch) {
        super(props);

        this.element = document.createElement('div');
        this.element.classList.add('overlay');
        this.element.id = 'overlay';
        this.element.addEventListener('click', (e: MouseEvent) => this.closeModal(e));
    }

    closeModal(e: MouseEvent) {
        if ((e.target as HTMLElement).id === 'overlay') {
            this.props.CloseModal();
        }
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

const MapDispatch = {
    CloseModal: () => ({ type: 'CLOSEMODAL' }),
};

export default connect(null, MapDispatch)(Overlay);
