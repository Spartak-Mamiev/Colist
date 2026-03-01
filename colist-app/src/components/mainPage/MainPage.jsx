import { Link } from 'react-router-dom';
import styles from './MainPage.module.css';
import Button from '../ui/Button';
import Input from '../ui/input/Input';

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
            <Button>Dinner</Button>
          </li>
          <li className={styles.listItem}>
            <Button>Home</Button>
          </li>
        </ul>
      </section>
      <footer>
        <Input
          type="search"
          placeholder="Add an item..."
        ></Input>
        <Button>+</Button>
      </footer>
    </main>
  );
}
