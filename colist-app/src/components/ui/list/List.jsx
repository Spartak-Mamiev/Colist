import styles from './List.module.css';
import { FaRegTrashAlt } from 'react-icons/fa';
import Button from '../button/Button';
import { Link } from 'react-router-dom';

// Renders a single list card — accepts a list object and an onDelete callback
export default function List({ list, onDelete }) {
  return (
    <Link
      to={`/list/${list.id}`} // Navigate to the dynamic list page
      className={styles.listContainer}
    >
      <div className={styles.listNameContainer}>
        <h3>{list.name}</h3>
      </div>
      <Button
        variant="transparent"
        aria-label="Delete list"
        onClick={onDelete} // Parent handles the delete logic
      >
        <FaRegTrashAlt fill="red" />
      </Button>
    </Link>
  );
}
