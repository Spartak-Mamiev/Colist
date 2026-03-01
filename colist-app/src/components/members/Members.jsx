import styles from './Members.module.css';
import Button from '../ui/Button';

export default function Members() {
  return (
    <div className={styles.membersPage}>
      <header className={styles.pageHeader}>
        <div className={styles.headerTopRow}>
          <Button>Back</Button>
          <h1>Members</h1>
        </div>
        <Button>
          <img
            src=""
            alt=""
            aria-hidden="true"
          />
          <span>Invite Member</span>
        </Button>
      </header>
      <main className={styles.mainContent}>
        <ul className={styles.listOfMembers}>
          <li className={styles.memberContainer}>
            <img
              src=""
              alt="John avatar"
              className={styles.memberAvatar}
            />
            <div className={styles.memberInfoContainer}>
              <h2>John</h2>
              <p>john@email.com</p>
            </div>
            <Button
              type="Button"
              className={styles.deleteBtn}
            >
              Delete
            </Button>
          </li>
        </ul>
      </main>
    </div>
  );
}
