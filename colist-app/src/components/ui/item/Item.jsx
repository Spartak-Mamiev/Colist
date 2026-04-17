import styles from './Item.module.css';
import Button from '../button/Button';
import { FaRegTrashAlt } from 'react-icons/fa';
import { MdOutlineModeEdit } from 'react-icons/md';

// Renders a single grocery item with a checkbox and delete button.
// onToggle is called when the checkbox is clicked.
// onDelete is called when the trash button is clicked.
export default function Item({
  name,
  addedBy,
  isCompleted,
  onToggle,
  onDelete,
  onClick,
  onEdit,
}) {
  return (
    <li
      className={styles.groceryItem}
      onClick={onClick}
    >
      <label className={styles.itemLabel}>
        <input
          type="checkbox"
          className={styles.itemCheckbox}
          checked={isCompleted} // Reflect the completed state from the database
          onChange={onToggle} // Toggle completed state in Supabase
          onClick={(event) => event.stopPropagation()}
        />
        <div className={styles.itemText}>
          <h3 className={styles.itemName}>{name}</h3>
          <small className={styles.itemMeta}>{addedBy}</small>
        </div>
      </label>
      <div className={styles.actions}>
        <Button
          variant="transparent"
          onClick={(event) => {
            event.stopPropagation();
            onEdit?.();
          }}
          aria-label="Edit item"
        >
          <MdOutlineModeEdit />
        </Button>
        <Button
          variant="transparent"
          onClick={(event) => {
            event.stopPropagation();
            onDelete(); // Delete the item from Supabase
          }}
          aria-label="Delete item"
        >
          <FaRegTrashAlt
            fill="red"
            className={styles.deleteBtn}
          />
        </Button>
      </div>
    </li>
  );
}
