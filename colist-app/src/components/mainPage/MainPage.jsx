import { Link } from 'react-router-dom';
import styles from './MainPage.module.css';

export default function MainPage() {
  return (
    <main className={styles.mainPage}>
      <header className={styles.header}>
        <h1 className={styles.title}>Your Lists</h1>
        <Link
          to="/settings"
          className={styles.settingsBtn}
        >
          Settings
        </Link>
      </header>
      <section
        className={styles.listsSection}
        aria-label="Your lists"
      >
        <ul className={styles.listGrid}>
          <li className={styles.listItem}>
            <button
              className={styles.listBtn}
              type="button"
            >
              Dinner
            </button>
          </li>
          <li className={styles.listItem}>
            <button
              className={styles.listBtn}
              type="button"
            >
              Home
            </button>
          </li>
        </ul>
      </section>
      <button
        className={styles.addListBtn}
        aria-label="Add new list"
      >
        +
      </button>
    </main>
  );
}
