import { Link } from 'react-router-dom';
import styles from './ListPage.module.css';
import Button from '../ui/button/Button';
import Header from '../ui/header/Header';
import Avatar from '../ui/avatar/Avatar';

import { HiOutlineUserAdd } from 'react-icons/hi';

export default function ListPage() {
  return (
    <>
      <header className={styles.header}>
        <Header children="Grocery List" />

        <div className={styles.collaboratorsBar}>
          <div
            aria-label="Collaborators"
            className={styles.collaboratorsList}
          >
            <Avatar children="M" />
            <Avatar children="S" />
          </div>
          <Button variant="transparent">
            <HiOutlineUserAdd />
            Invite
          </Button>
        </div>
      </header>
      <main className={styles.groceryList}>
        <section
          aria-label="Active items"
          className={styles.activeSection}
        >
          <h2 className={styles.sectionTitle}>Active</h2>
          <ul className={styles.activeItems}>
            <li className={styles.groceryItem}>
              <label className={styles.itemLabel}>
                <input
                  type="checkbox"
                  className={styles.itemCheckbox}
                />
                <span className={styles.itemName}>Milk</span>
              </label>
              <small className={styles.itemMeta}>Added by You</small>
            </li>
            <li className={styles.groceryItem}>
              <label className={styles.itemLabel}>
                <input
                  type="checkbox"
                  className={styles.itemCheckbox}
                />
                <span className={styles.itemName}>Milk</span>
              </label>
              <small className={styles.itemMeta}>Added by You</small>
            </li>
          </ul>
        </section>
        <section
          aria-label="Completed items"
          className={styles.completedSection}
        >
          <h2 className={styles.sectionTitle}>Completed</h2>
          <ul className={styles.completedItems}>
            <li className={styles.groceryItem}>
              <label className={styles.itemLabel}>
                <input
                  type="checkbox"
                  defaultChecked
                  className={styles.itemCheckbox}
                />
                <span className={styles.itemName}>Milk</span>
              </label>
              <small className={styles.itemMeta}>Added by You</small>
            </li>
            <li className={styles.groceryItem}>
              <label className={styles.itemLabel}>
                <input
                  type="checkbox"
                  defaultChecked
                  className={styles.itemCheckbox}
                />
                <span className={styles.itemName}>Milk</span>
              </label>
              <small className={styles.itemMeta}>Added by You</small>
            </li>
          </ul>
        </section>
      </main>
    </>
  );
}
