import { useState } from 'react';
import styles from './Modal.module.css';
import Input from '../input/Input';
import Button from '../button/Button';

import { IoClose } from 'react-icons/io5';

// Reusable modal component.
// onSubmit receives the input value when the main button is clicked.
// error displays an error message inside the modal.
export default function Modal({
  listName,
  cta,
  type,
  value,
  variant,
  mainBtnName,
  error,
  onClose,
  onSubmit,
}) {
  const [inputValue, setInputValue] = useState(value || '');

  function handleFormSubmit(e) {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(inputValue); // Pass the input value to the parent handler
    }
  }

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
    >
      <div
        className={styles.modal}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.modalTop}>
          <h3 className={styles.modalName}>{listName}</h3>
          <Button
            variant="transparent"
            onClick={onClose}
            aria-label="Close"
          >
            <IoClose />
          </Button>
        </div>
        <p className={styles[variant]}>{cta}</p>
        <form
          onSubmit={handleFormSubmit}
          className={styles.form}
        >
          <Input
            type={type}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          {/* Display error message if there is one */}
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.buttons}>
            <Button
              variant="secondary"
              onClick={onClose}
              type="button"
            >
              Cancel
            </Button>
            <Button
              variant="modalBtn"
              type="submit"
            >
              {mainBtnName}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
