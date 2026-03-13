import styles from './List.module.css';
import { FaRegTrashAlt } from 'react-icons/fa';
import { MdOutlineModeEdit } from 'react-icons/md';
import Button from '../button/Button';
import { Link } from 'react-router-dom';

// Renders a single list card — accepts a list object and an onDelete callback
export default function List({ list, onDelete, onEdit }) {
  return (
    <Link
      to={`/list/${list.id}`} // Navigate to the dynamic list page
      className={styles.listContainer}
    >
      <div className={styles.listNameContainer}>
        <h3>{list.name}</h3>
      </div>
      <div className={styles.actions}>
        <Button
          variant="transparent"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onEdit?.();
          }}
          aria-label="Edit list"
        >
          <MdOutlineModeEdit />
        </Button>
        <Button
          variant="transparent"
          aria-label="Delete list"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete?.(e);
          }}
        >
          <FaRegTrashAlt fill="red" />
        </Button>
      </div>
    </Link>
  );
}
