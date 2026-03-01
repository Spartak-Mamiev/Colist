import { Link } from 'react-router-dom';
import styles from './MainPage.module.css';
import Button from '../ui/button/Button';
import Input from '../ui/input/Input';
import Header from '../ui/header/Header';

export default function MainPage() {
  return (
    <main className={styles.mainPage}>
      <Header>Your Lists</Header>
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
