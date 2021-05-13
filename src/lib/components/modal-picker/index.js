import React, { useRef } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';

import './style.scss';
import { FADE_MILLI } from './constants';

const ModalPicker = ({
  children,
  isVisible,
  toggleModal,
}) => {
  const hourTransRef = useRef(null);
  return ReactDOM.createPortal(
    <CSSTransition
      nodeRef={hourTransRef}
      in={isVisible}
      timeout={FADE_MILLI}
      classNames="modalpicker__transition"
      unmountOnExit
      mountOnEnter
    >
      <div className="modalpicker" ref={hourTransRef}>
        <button
          aria-label="Close"
          className="modalpicker__overlay"
          data-dismiss="modal"
          type="button"
          onClick={toggleModal}
        >
          <span aria-hidden="true"> ×</span>
        </button>
        <div className="modalpicker__wrapper">
          {children}
        </div>
      </div>
    </CSSTransition>,
    document.body,
  );
};

ModalPicker.defaultProps = {
  isVisible: false,
  toggleModal: () => {},
};

ModalPicker.propTypes = {
  children: PropTypes.node.isRequired,
  isVisible: PropTypes.bool,
  toggleModal: PropTypes.func,
};

export default ModalPicker;
