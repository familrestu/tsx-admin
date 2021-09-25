import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { AppState } from 'redux/store';

type OverlayPropsType = {
    children?: React.ReactChild[] | React.ReactChild | Element | Element[] | null;
    className?: string;
    id?: string;

    closeDialogBox?: () => void;
};

class Overlay extends Component<OverlayPropsType & MapStateToPropsType & typeof MapDispatch> {
    rootElement: HTMLElement | null = document.getElementById('root-container');
    element: HTMLDivElement;

    constructor(props: OverlayPropsType & MapStateToPropsType & typeof MapDispatch) {
        super(props);

        this.element = document.createElement('div');
        this.element.classList.add('overlay');

        if (this.props.className) {
            for (let x = 0; x < this.props.className.split(' ').length; x++) {
                const classProps = this.props.className.split(' ')[x];
                this.element.classList.add(classProps);
            }
        }

        this.element.id = this.props.id ? this.props.id : 'overlay';

        this.element.addEventListener('mousedown', (e: MouseEvent) => this.closeModal(e));
        /* this.element.addEventListener('mouseup', (e: MouseEvent) => {
            console.log(e);
        }); */
    }

    closeModal(e: MouseEvent) {
        const target = e.target as HTMLDivElement;
        if (target.id === 'overlay') {
            if (target.children[0]) {
                target.children[0].classList.add('hidden');
            }

            window.setTimeout(() => {
                /* modal */
                if (this.props.ModalState.isOpened) {
                    this.props.CloseModal();
                }

                /* dialog box */
                if (this.props.closeDialogBox) {
                    this.props.closeDialogBox();
                }
            }, 250);
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

type MapStateToPropsType = {
    ModalState: AppState['ModalState'];
};

const MapStateToProps = (state: MapStateToPropsType) => ({
    ModalState: state.ModalState,
});

const MapDispatch = {
    CloseModal: () => ({ type: 'CLOSEMODAL' }),
};

export default connect(MapStateToProps, MapDispatch)(Overlay);
