import React, { Component } from 'react';
import Overlay from 'components/Overlay';
import { Button } from 'react-bootstrap';
import { ReactComponent as AlertSVG } from 'assets/svg/alert.svg';

type AlertPropsType = {
    children?: React.ReactChild[] | React.ReactChild | Element | Element[];
    header?: string;
    body?: string;
    close?: () => void;
};

class Alert extends Component<AlertPropsType> {
    render() {
        return (
            <Overlay>
                {this.props.children ? (
                    this.props.children
                ) : (
                    <div className="alert-container shadow">
                        <div className="alert-header">
                            <div className="icon">
                                <AlertSVG />
                            </div>
                            <div className="text">{this.props.header}</div>
                        </div>
                        <div className="alert-body">{this.props.body}</div>
                        <div className="d-flex justify-content-center m-1">
                            <Button onClick={this.props.close}>Close</Button>
                        </div>
                    </div>
                )}
            </Overlay>
        );
    }
}

export default Alert;
