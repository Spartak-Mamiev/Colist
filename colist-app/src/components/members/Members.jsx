import styles from "./Members.module.css";

export default function Members() {
  return (
    <>
      <header>
        <div>
          <button className={styles.backBtn}>Back</button>
          <h1>Members</h1>
        </div>
        <button className={styles.inviteBtn}>
          <img src="" alt="" />
          <p>Invite Member</p>
        </button>
      </header>
      <main>
        <ul className={styles.listOfMembers}>
          <li className={styles.memberContainer}>
            <img src="" alt="members avatar" className={styles.memberAvatar} />
            <div className={styles.memberInfoContainer}>
              <h2>John</h2>
              <p>john@email.com</p>
            </div>
            <button className={styles.deleteBtn}>Delete</button>
          </li>
        </ul>
      </main>
    </>
  );
}
