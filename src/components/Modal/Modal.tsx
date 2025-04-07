import React from 'react';
import styles from './Modal.module.scss';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  svgCode: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, svgCode }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <span className={styles.close} onClick={onClose}>
          &times;
        </span>
        <h2>SVG Code:</h2>
        <textarea value={svgCode} readOnly className={styles.textarea} />
      </div>
    </div>
  );
};

export default Modal;
