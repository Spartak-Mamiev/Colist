import styles from './Modal.module.css';
import Input from '../input/Input';
import Button from '../button/Button';

import { IoClose } from 'react-icons/io5';

export default function Modal() {
  return (
    <div className={styles.modal}>
      <div className={styles.modalTop}>
        <h3 className={styles.modalName}>Edit Item</h3>
        <Button variant="transparent">
          <IoClose />
        </Button>
      </div>
      <form
        action="submit"
        className={styles.form}
      >
        <Input value="Milk"></Input>
        <div className={styles.buttons}>
          <Button variant="secondary">Cancel</Button>
          <Button variant="modalBtn">Save</Button>
        </div>
      </form>
    </div>
  );
}
