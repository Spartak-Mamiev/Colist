import styles from "./Members.module.css";

export default function Members() {
  return (
    <div className={styles.membersPage}>
      <header className={styles.pageHeader}>
        <div className={styles.headerTopRow}>
          <button className={styles.backBtn}>Back</button>
          <h1>Members</h1>
        </div>
        <button type="button" className={styles.inviteBtn}>
          <img src="" alt="" aria-hidden="true" />
          <span>Invite Member</span>
        </button>
      </header>
      <main className={styles.mainContent}>
        <ul className={styles.listOfMembers}>
          <li className={styles.memberContainer}>
            <img src="" alt="John avatar" className={styles.memberAvatar} />
            <div className={styles.memberInfoContainer}>
              <h2>John</h2>
              <p>john@email.com</p>
            </div>
            <button type="button" className={styles.deleteBtn}>
              Delete
            </button>
          </li>
        </ul>
      </main>
    </div>
  );
}
