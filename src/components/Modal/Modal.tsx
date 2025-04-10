import React from 'react';
import styles from './Modal.module.scss';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  svgCode: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, svgCode }) => {
  if (!isOpen) return null;

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className={styles.modal} onClick={onClose}>
      <div className={styles.modalContent} onClick={handleContentClick}>
        <button className={styles.close} onClick={onClose} aria-label="Close">
          ✕
        </button>
        <h2 className={styles.title}>SVG Code:</h2>
        <div className={styles.textareaWrapper}>
          <textarea
            value={svgCode}
            readOnly
            className={styles.textarea}
            aria-label="SVG Code Output"
          />
        </div>
      </div>
    </div>
  );
};

export default Modal;
