import './modal.css';

import React from 'react';
import { createPortal } from 'react-dom';

// assuming in your html file has a div with id 'modal-root';
const modalRoot = document.getElementById("modal-root") as HTMLElement;

export default class Modal extends React.Component<{ children?: React.ReactNode }> {
  el: HTMLElement = document.createElement("div");

  componentDidMount() {
    modalRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    modalRoot.removeChild(this.el);
  }

  render() {
    return createPortal(this.props.children, this.el);
  }
}