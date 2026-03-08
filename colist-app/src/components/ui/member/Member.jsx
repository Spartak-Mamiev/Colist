import styles from './Member.module.css';
import Avatar from '../avatar/Avatar';
import Button from '../button/Button';
import { FaRegTrashAlt } from 'react-icons/fa';

// Renders a single member row with avatar, name, email, and optional remove button.
// isOwner hides the remove button (can't remove the list owner).
// isCurrentUser labels the member as "You".
export default function Member({
  name,
  email,
  onRemove,
  isOwner,
  isCurrentUser,
}) {
  return (
    <div className={styles.memberContainer}>
      <div className={styles.infoContainer}>
        {/* Show the first letter of the member's name as their avatar */}
        <Avatar>{name?.charAt(0).toUpperCase() || '?'}</Avatar>
        <div className={styles.memberInfo}>
          <p className={styles.name}>
            {name}
            {isCurrentUser && ' (You)'}
            {isOwner && ' — Owner'}
          </p>
          <p className={styles.email}>{email}</p>
        </div>
      </div>

      {/* Only show remove button if this member is not the owner */}
      {!isOwner && onRemove && (
        <Button
          variant="transparent"
          aria-label="Remove member"
          onClick={onRemove}
        >
          <FaRegTrashAlt fill="red" />
        </Button>
      )}
    </div>
  );
}
